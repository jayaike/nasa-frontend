"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { useEstimateHazard } from "./hooks/useEstimateHazard";

const formSchema = z.object({
  maxDiameter: z.string().min(1).pipe(z.coerce.number()),
  minDiameter: z.string().min(1).pipe(z.coerce.number()),
  relativeVelocity: z.string().min(1).pipe(z.coerce.number()),
  missDistance: z.string().min(1).pipe(z.coerce.number()),
  magnitude: z.string().min(1).pipe(z.coerce.number()),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxDiameter: "" as any,
      minDiameter: "" as any,
      relativeVelocity: "" as any,
      missDistance: "" as any,
      magnitude: "" as any,
    },
  });

  const { data, mutateAsync, reset, isPending } = useEstimateHazard();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutateAsync(values);
  }

  return (
    <>
      <div className="max-w-md mx-auto pt-10">
        <div className="text-center mb-4">
          <ModeToggle />
        </div>

        <div className="text-3xl my-4 text-center font-bold">
          Asteroid Hazard Estimator
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 border rounded-md p-4"
          >
            <FormField
              control={form.control}
              name="minDiameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Diameter (km)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum Diameter of the Asteroid.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDiameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Diameter (km)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum Diameter of the Asteroid.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relativeVelocity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relative Velocity (km/s)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Velocity of the Asteroid relative to the Earth.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="missDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miss Distance (km)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Distance which the Asteroid missed the Earth.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="magnitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Absolute Magnitude (M)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Describes intrinsic luminosity which is a measure of the
                    total amount of light emitted by the asteroid.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              Check Asteroid{" "}
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
      <AlertDialog
        open={!!data}
        onOpenChange={(v) => {
          if (v) return;

          form.reset({
            maxDiameter: "" as any,
            minDiameter: "" as any,
            relativeVelocity: "" as any,
            missDistance: "" as any,
            magnitude: "" as any,
          });
          reset();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Asteroid is{" "}
              {data?.isHazardous ? (
                <span className="text-red-500">Hazardous</span>
              ) : (
                <span className="text-green-500">Not Hazardous</span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Our ML model has predicted that this Asteroid is{" "}
              {data?.isHazardous ? <>Hazardous</> : <>Not Hazardous</>} to the
              Earth with a confidence of {data?.probability}%
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="!justify-center">
            <AlertDialogCancel>Okay</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
