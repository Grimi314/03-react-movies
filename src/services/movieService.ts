import axios from "axios";
import type {Movie} from "../types/movie.ts"
const myKey = import.meta.env.VITE_API_KEY;
const URL = "https://api.themoviedb.org/3/search/movie";
 


interface ApiResponse{
     results: Movie[]
}

export async  function handleSearch(search: string): Promise<Movie[]> {
   const response = await axios.get<ApiResponse>(URL, {
    params: {
      query: search,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
  });

   return response.data.results ?? [];
 }