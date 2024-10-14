import { createUploadthing, type FileRouter } from "uploadthing/next";
import { useSession } from "next-auth/react";

const f = createUploadthing();

const handleAuth = () => {
  const { data: session } = useSession();

  if (!session) throw new Error("Unauthorized");
  return { session };
};

export const ourFileRouter = {
  image: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;