import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { SelectGuestbook } from "@db/schema";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
});

interface GuestbookProps {
  invitationId: number;
}

export function Guestbook({ invitationId }: GuestbookProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  const { data: entries = [], isLoading } = useQuery<SelectGuestbook[]>({
    queryKey: [`/api/guestbook/${invitationId}`],
  });

  const createEntry = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await apiRequest(
        "POST",
        `/api/guestbook/${invitationId}`,
        values
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/guestbook/${invitationId}`] });
      toast({
        title: "Message sent!",
        description: "Thank you for signing our guestbook.",
      });
      form.reset();
      setIsFormOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Guestbook</h2>
        <Button
          variant={isFormOpen ? "outline" : "default"}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? "Cancel" : "Sign Guestbook"}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => createEntry.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message..."
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createEntry.isPending}
              >
                {createEntry.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </Card>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(entry.createdAt))}
                </p>
              </div>
              <p className="text-muted-foreground">{entry.message}</p>
            </div>
          </Card>
        ))}

        {entries.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground">
            No messages yet. Be the first to sign the guestbook!
          </p>
        )}
      </div>
    </div>
  );
}
