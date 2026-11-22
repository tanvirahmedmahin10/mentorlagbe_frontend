export const dynamic = "force-dynamic";

export default function TempThrowPage() {
  throw new Error("TEMP_ERROR_BOUNDARY_CHECK");
}
