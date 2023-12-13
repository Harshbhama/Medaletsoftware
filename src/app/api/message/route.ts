import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { SendMessageValidator } from "@/app/lib/validators/SendMessageValidator";
import { db } from "@/db";
export const POST = async (req: NextRequest) => {
  // end point for asking a question to a pdf file
  const body = await req.json()
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const userId = user?.id
  if(!userId){
    return new Response("Unathorized", {status: 401})
  }
  const {fileId, message} = SendMessageValidator.parse(body)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId
    }
  })

  if(!file) return new Response("Not found", {status: 404})

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId
    }
  })

  // Simulare results

  const results = "Test"

  const prevMessages = await db.message.findMany({
    where: {
      fileId
    },
    orderBy: {
      createdAt: "asc"
    },
    take: 6
  })

  const formattedMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? "user" as const : "assistant" as const,
    content: msg.text
  }))
  
  // const response = 

}