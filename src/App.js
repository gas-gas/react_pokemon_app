import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import Card from "./components/Card/Card.js";
import NavBar from "./components/NavBar/NavBar.js";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細データを取得
      await loadPokemon(res.results);
      console.log(res);

      setPrevUrl(res.previous);
      setNextUrl(res.next);
      setLoading(false); // ローディングの終了
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecod = getPokemon(pokemon.url);
        return pokemonRecod;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let res = await getAllPokemon(prevUrl);
    await loadPokemon(res.results);

    setPrevUrl(res.previous);
    setNextUrl(res.next);
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let res = await getAllPokemon(nextUrl);
    await loadPokemon(res.results);

    setPrevUrl(res.previous);
    setNextUrl(res.next);
    setLoading(false);
  };

  return (
    <>
      <NavBar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
