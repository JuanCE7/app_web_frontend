"use client";

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
import {
  createUseCase,
  getUseCaseById,
  updateUseCase,
} from "../../../useCases.api";
import { DataTable } from "@/components/Data-Table";
import { columns } from "./columns";
import { useSession } from "next-auth/react";

export function UseCaseForm(props: UseCaseFormProps) {
  const { useCase } = props;
  const [useCases, setUseCases] = useState([]);
  const { data: session } = useSession();

  const router = useRouter();

  const isEditMode = Boolean(useCase?.id);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (session?.user?.email) {
          setUseCases(useCase);
        } else {
          throw new Error("User session not available");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: useCase?.name || "",
      description: useCase?.description || "",
      image: useCase?.image || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode) {
        // Modo edición
        await updateUseCase(useCase.id, values);
        toast({
          title: "Project updated!",
        });
      } else {
        // Modo creación
        await createUseCase(values);
        toast({
          title: "Project created!",
        });
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
                  <Input
                    placeholder="Use Case name..."
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Descripción del proyecto */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description..."
                    {...field}
                    value={form.getValues().description ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DataTable
          columns={columns}
          data={listUseCases}
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
