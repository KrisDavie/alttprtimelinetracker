import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { useAppSelector } from "../../app/hooks"
import { selectAvailableDevices } from "./usb2snesSlice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Usb2SnesSettings() {
  const devices: string[] = useAppSelector(selectAvailableDevices)
  const FormSchema = z.object({
    hostname: z.union([
      z.string().url({
        message: "Please enter a valid URL.",
      }),
      z.string().ip(),
    ]),
    port: z.number().int().min(1).max(65535),
    device: z.string().refine((d) => devices.includes(d)),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hostname: "127.0.0.1",
      port: 8080,
      device: "No devices...",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  useEffect(() => {
    if (devices.length > 0) {
      console.log("setting device")
      form.setValue("device", devices[0])
    }
  }, [devices])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-auto space-x-1 py-5 flex flex-col items-left"
        >
          <FormField
            control={form.control}
            name="hostname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostname/IP</FormLabel>
                <FormControl>
                  <Input
                    className="w-80"
                    placeholder="127.0.0.1"
                    {...field}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input className="w-80" placeholder="8080" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="device"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-80">
                      <SelectValue placeholder="Select a device">
                        {form.watch("device")}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device} value={device}>
                        {device}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-80">
            Submit
          </Button>
        </form>
      </Form>
    </>
  )
}

export default Usb2SnesSettings
