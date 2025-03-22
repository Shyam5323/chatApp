import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (e) {
    console.error(e);
  }
};
const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    await ctx.runMutation(internal.log.logEvent, {
      eventType: "webhook.error",
      data: "Could not validate webhook",
    });
    return new Response("Could not validate webhook", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        await ctx.runMutation(internal.log.logEvent, {
          eventType: "user.updated",
          data: `User ${user.clerkId} already exists, updating instead.`,
        });
      } else {
        await ctx.runMutation(internal.user.create, {
          username: `${event.data.first_name} ${event.data.last_name}`,
          imageUrl: event.data.image_url,
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
        });
        await ctx.runMutation(internal.log.logEvent, {
          eventType: "user.created",
          data: `User created: ${event.data.id}`,
        });
      }
      break;

    case "user.updated":
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });

      await ctx.runMutation(internal.log.logEvent, {
        eventType: "user.updated",
        data: `User updated: ${event.data.id}`,
      });
      break;

    default:
      await ctx.runMutation(internal.log.logEvent, {
        eventType: "webhook.unknown",
        data: `Unhandled event type: ${event.type}`,
      });
  }

  return new Response(null, { status: 200 });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
