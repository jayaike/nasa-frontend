import { useMutation } from "@tanstack/react-query";

export function useEstimateHazard() {
  return useMutation({
    mutationKey: ["estimate-hazard"],
    mutationFn: async (values: {
      maxDiameter: number;
      minDiameter: number;
      relativeVelocity: number;
      missDistance: number;
      magnitude: number;
    }) => {
      const params = new URLSearchParams();

      params.set("max_diameter", values.maxDiameter.toString());
      params.set("min_diameter", values.minDiameter.toString());
      params.set("relative_velocity", values.relativeVelocity.toString());
      params.set("miss_distance", values.missDistance.toString());
      params.set("magnitude", values.magnitude.toString());

      const response = await fetch(
        `https://nasa-blond.vercel.app?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return (await response.json()) as {
        isHazardous: boolean;
        probability: string;
      };
    },
  });
}
