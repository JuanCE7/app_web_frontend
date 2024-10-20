"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormCreateProjectProps } from "./FormCreateProject.types";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "@/hooks/use-toast";
import { createProject } from "../../projects.api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useState } from "react";

const formSchema = z.object({
  name: z.string(),
  description: z.string().min(2),
  image: z.string(),
  creatorId: z.string(),
});

export function FormCreateProject(props: FormCreateProjectProps) {
  const { setOpenModalCreate } = props;
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      creatorId: "",
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session?.user?.email) {
        const user = await getUserLogged(session.user.email);
        values.creatorId = user.id; 
        console.log("Final values with creatorId:", values);
        await createProject(values);
        toast({ title: "Project created" });
        router.refresh();
        setOpenModalCreate(false);
      } else {
        throw new Error("User session not available");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre del Proyecto"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descripción del Proyecto"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  {photoUploaded ? (
                    <p className="text-sm">Image uploaded!</p>
                  ) : (
                    <UploadButton
                      className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                      {...field}
                      endpoint="image"
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res?.[0].url);
                        toast({
                          title: "Photo uploaded!",
                        });
                        setPhotoUploaded(true);
                      }}
                      onUploadError={(error: Error) => {
                        console.log(error);
                        toast({
                          title: "Error uploading photo",
                        });
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={!isValid}>
          Crear
        </Button>
      </form>
    </Form>
  );
}
