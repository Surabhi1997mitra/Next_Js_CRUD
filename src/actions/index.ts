// Server actions will be defined here

'use server';
//all functions exported from this file will be considered as server actions

import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editSnippet(id: number, code: string) {
    await db.snippet.update({
        where: { id },
        data: { code }
    })
    revalidatePath(`/snippets/${id}`)
    redirect(`/snippets/${id}`)
}

export async function deleteSnippet(id: number) {
    await db.snippet.delete({
        where: { id }
    })
    revalidatePath('/')
    redirect('/')
}


export async function createSnippet(formState: { message: string }, formData: FormData) {
    try {
        //validate user's input
        const title = formData.get('title')
        const code = formData.get('code')

        if (typeof title !== 'string' || title.length < 3) {
            return {
                message: "Title must be longer"
            }
        }

        if (typeof code !== 'string' || code.length < 10) {
            return {
                message: "Code must be longer"
            }
        }

        //create a new record in db
        await db.snippet.create({
            data: { title, code }
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            return {
                message: err.message
            }
        } else {
            return {
                message: 'Something went wrong. :('
            }
        }

    }

    revalidatePath('/')
    //reroute or redirect user to home page
    // always keep redirect outside try catch block because redirect throws the error NEXT_REDIRECT
    redirect('/')
}
