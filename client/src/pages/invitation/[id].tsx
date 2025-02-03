import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";
import Template1 from "@/components/templates/template1";
import Template2 from "@/components/templates/template2";
import Template3 from "@/components/templates/template3";
import { AudioPlayer } from "@/components/audio-player";
import { Guestbook } from "@/components/guestbook";

export default function Invitation() {
  const { id } = useParams();

  const { data: invitation, isLoading } = useQuery({
    queryKey: [`/api/invitations/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Invitation not found</h1>
      </div>
    );
  }

  const TemplateComponent = {
    template1: Template1,
    template2: Template2,
    template3: Template3,
  }[invitation.templateId];

  return (
    <>
      <TemplateComponent invitation={invitation} />
      <div className="container mx-auto px-4 py-16">
        <Guestbook invitationId={invitation.id} />
      </div>
      {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} />}
    </>
  );
}