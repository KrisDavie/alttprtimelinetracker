import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useGetRaceDataQuery } from "../racetimeApi/apiSlice"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"

function RacetimeForm() {
  const FormSchema = z.object({
    raceroom: z
      .string()
      .url({
        message: "Please enter a valid URL.",
      })
      .includes("racetime.gg"),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Get final part of URL
    setCurUrl(data.raceroom.split("/").pop()!)
  }
  const [curUrl, setCurUrl] = useState("")

  // Side effect is handled by the query
  useGetRaceDataQuery(curUrl, {
    skip: !curUrl,
  })
  return (
    <>
      <div>{curUrl}</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-auto space-x-1 py-5 flex flex-row items-center"
        >
          <FormField
            control={form.control}
            name="raceroom"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-80"
                    placeholder="rt.gg room"
                    {...field}
                    defaultValue={
                      "https://racetime.gg/alttpr/powerful-sahasrahla-1473"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}

export default RacetimeForm
