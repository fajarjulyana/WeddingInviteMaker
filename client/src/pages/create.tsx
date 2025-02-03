import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, X } from "lucide-react";
// Define form schema with Zod
const formSchema = z.object({
  brideNames: z.string().min(1),
  groomNames: z.string().min(1),
  date: z.string().min(1),
  venue: z.string().min(1),
  photos: z.array(z.instanceof(File)).min(1),  // Expecting File objects
  musicFile: z.instanceof(File).optional(),
  templateId: z.string().min(1),
});

export default function Create() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [previewTemplate, setPreviewTemplate] = useState("template1");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photos: [],
      templateId: "template1",
    },
  });

  // Mutation to create the invitation
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("brideNames", values.brideNames);
      formData.append("groomNames", values.groomNames);
      formData.append("date", values.date);
      formData.append("venue", values.venue);
      formData.append("templateId", values.templateId);

      // Append photos
      values.photos.forEach((photo) => formData.append("photos", photo));
      if (values.musicFile) {
        formData.append("musicFile", values.musicFile);
      }

      const res = await fetch("/api/invitations", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create invitation");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invitation created!",
        description: "Your wedding invitation has been created successfully.",
      });
      setLocation(`/invitation/${data.slug}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-8">Create Wedding Invitation</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="brideNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bride's Names</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bride's names" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groomNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Groom's Names</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter groom's names" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wedding Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter wedding venue" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wedding Photos</FormLabel>
                    <FormControl>
                      <PhotoUpload {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="musicFile"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Background Music (MP3)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="audio/mpeg,audio/mp3"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Template</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setPreviewTemplate(value);
                        }}
                        value={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        {["template1", "template2", "template3"].map((template) => (
                          <div key={template} className="relative">
                            <RadioGroupItem
                              value={template}
                              id={template}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={template}
                              className="block cursor-pointer rounded-lg border-2 border-muted p-2 hover:border-primary peer-checked:border-primary"
                            >
                              <img
                                src={[
                                  "https://images.unsplash.com/photo-1489924124654-85017dad789d",
                                  "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2",
                                  "https://images.unsplash.com/photo-1510076857177-7470076d4098",
                                ][Number(template.slice(-1)) - 1]}
                                alt={`Template ${template.slice(-1)}`}
                                className="w-full h-24 object-cover rounded"
                              />
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Invitation"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}


function PhotoUpload({ value = [], onChange }) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState(value);

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length + photos.length > 7) {
      toast({
        title: "Too many photos",
        description: "You can only upload up to 7 photos",
        variant: "destructive",
      });
      return;
    }

    const newPhotos = files.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));
    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    onChange(updatedPhotos);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={photo.preview}
              alt={`Wedding photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removePhoto(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      {photos.length < 7 && (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload photos (max 7)</p>
            </div>
            <Input type="file" className="hidden" accept="image/*" multiple onChange={handlePhotoChange} />
          </label>
        </div>
      )}
    </div>
  );
}


