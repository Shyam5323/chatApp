"use client";
import Uploader from "@/components/shared/uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { File, Image } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  toggle: (newState: boolean) => void;
  type: "image" | "file";
};

const uploadFileSchema = z.object({
  files: z
    .string()
    .array()
    .min(1, { message: "You must select atleast one file" }),
});
const UploadFileDialog = ({ open, toggle, type }: Props) => {
  const form = useForm<z.infer<typeof uploadFileSchema>>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: { files: [] },
  });

  const params = useParams();
  const conversationId = params?.conversationId as Id<"conversations">;

  const files = form.watch("files");
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  const handleSubmit = async (values: z.infer<typeof uploadFileSchema>) => {
    createMessage({
      conversationId,
      type,
      content: values.files,
    })
      .then(() => {
        form.reset();
        toggle(false);
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.data : "Unexpected error"
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => toggle(open)}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          {type === "image" ? <Image /> : <File />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            {type === "image" ? "Upload Image" : "Upload any file"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="files"
              render={() => {
                return (
                  <FormItem>
                    <FormControl>
                      <div className="py-4">
                        <Uploader
                          type={type}
                          onChange={(urls) => {
                            form.setValue("files", [...files, ...urls]);
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button disabled={!files.length || pending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
