import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
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
import { UseCaseFormProps } from "./UseCaseForm.types";
import { formSchema } from "./UseCaseForm.form";
import { toast } from "@/hooks/use-toast";
import { createUseCase, updateUseCase } from "../../../useCases.api";
import { DataTable } from "@/components/Data-Table";
import { columns } from "./columns";
import { useSession } from "next-auth/react";

export function UseCaseForm(props: UseCaseFormProps) {
  const { useCase } = props;
  const [listEntries, setListEntries] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const isEditMode = Boolean(useCase?.id);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       if (session?.user?.email) {
  //         // Procesa los datos según la sesión del usuario.
  //         setListEntries(useCase?.entries || []);
  //       } else {
  //         throw new Error("User session not available");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //     }
  //   };

  //   if (session) fetchProjects();
  // }, [session, useCase]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: useCase?.name || "",
      description: useCase?.description || "",
      entries: useCase?.entries || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode) {
        await updateUseCase(useCase.id, values);
        toast({ title: "Project updated!" });
      } else {
        await createUseCase(values);
        toast({ title: "Project created!" });
      }
      router.push("/projects");
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
                <FormLabel>Use Case Name</FormLabel>
                <FormControl>
                  <Input placeholder="Use Case name..." type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DataTable
          columns={columns}
          data={listEntries}
          placeholder="Filter for entries ..."
          filter="entries"
        />
        <Button type="submit">
          {isEditMode ? "Edit project" : "Create project"}
        </Button>
      </form>
    </Form>
  );
}
