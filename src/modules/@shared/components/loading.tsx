import loadingStore from "@/store/loading.store";
import LoadingSpinner from "@/assets/loading.svg";

export default function AppLoading() {
  const _loadingStore = loadingStore((state) => state);

  if (!_loadingStore.show) return <></>;

  return (
    <section className="h-screen w-screen fixed z-[1000] top-0 left-0 flex gap-4 flex-col items-center justify-center backdrop-blur">
      <img src={LoadingSpinner} alt="Loading..." className="w-24" />
      {!!_loadingStore.message && <p>{_loadingStore.message}</p>}
    </section>
  );
}
