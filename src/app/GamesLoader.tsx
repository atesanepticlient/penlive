"use client";
import { useFetchGamesListQuery } from "@/lib/features/gamesApiSlice";


const GamesLoader = () => {
  const { data } = useFetchGamesListQuery({});
  // const { data: newProviderData, isLoading: isNewProviderLoading } = useFetchNewProviderGamesListQuery();

  console.log({ gamesList: data });

  // const { setLoading, setGames } = useGames((state) => state);

  // useEffect(() => {
  //   if (!isNewProviderLoading && newProviderData) {
  //     setLoading(false);
  //     setGames(newProviderData.gamesList);
  //     console.log('new done')
  //   }

  //   if (!isOldProviderLoading && oldProviderData) {
  //     setLoading(false);
  //     setGames(oldProviderData.gamesList);
  //     console.log('old done')
  //   }

  //   if (!isLoading && gamesData) {
  //     setLoading(false);
  //     setGames(gamesData.gamesList);
  //   }
  // }, [gamesData, isLoading]);

  return null;
};

export default GamesLoader;
