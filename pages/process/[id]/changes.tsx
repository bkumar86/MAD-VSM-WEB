import { updates } from "services/projectApi";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function ChangesPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery(["Changes", id], () => updates(id));
  return (
    <div>
      <h1>Changes</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        data?.map((update) => <p>{JSON.stringify(update)}</p>)
      )}
    </div>
  );
}
