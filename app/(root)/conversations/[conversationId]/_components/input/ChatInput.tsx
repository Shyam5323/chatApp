"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

import { useParams } from "next/navigation";

import { z } from "zod";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon } from "lucide-react";
import MessageActionsPopover from "./MessageActionsPopover";
import { useTheme } from "next-themes";
import EmojiPicker, { Theme } from "emoji-picker-react";

const chatMessageSchema = z.object({
  content: z.string().min(1, {
    message: "This field cant be empty",
  }),
});

const ChatInput = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<any>(null);

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const [cursorPosition, setCursorPosition] = useState(0);

  const params = useParams();
  const conversationId = params?.conversationId as Id<"conversations">;

  const { theme } = useTheme();

  const { mutate: createMessge, pending } = useMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = form.watch("content", "");

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
      setCursorPosition(selectionStart);
    }
  };

  const insertEmoji = (emoji: string) => {
    const newText = [
      content.substring(0, cursorPosition),
      emoji,
      content.substring(cursorPosition),
    ].join("");

    form.setValue("content", newText);
    setCursorPosition(cursorPosition + emoji.length);
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessge({
      conversationId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
        textAreaRef.current?.focus();
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.data : "Unexpected error"
        );
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="absolute bottom-16" ref={emojiPickerRef}>
        <EmojiPicker
          open={emojiPickerOpen}
          theme={theme as Theme}
          onEmojiClick={(emojiDetails) => {
            insertEmoji(emojiDetails.emoji);
            setEmojiPickerOpen(false);
          }}
          lazyLoadEmojis
        />
      </div>
      <div className="flex gap-2 items-end w-full">
        <MessageActionsPopover setEmojiPickerOpen={setEmojiPickerOpen} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }
                        }}
                        rows={1}
                        maxRows={3}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder="type a message"
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            />
            <Button disabled={pending} size="icon" type="submit">
              <SendHorizonalIcon />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
