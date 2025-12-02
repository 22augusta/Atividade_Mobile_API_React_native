import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
};

const API_KEY = "SUA_API_KEY_AQUI"; // Substitua pela sua chave da TMDB
const API_BASE = "https://api.themoviedb.org/3";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      const endpoint = query
        ? `${API_BASE}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`
        : `${API_BASE}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, [query]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Carregando filmes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Buscar filmes..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        onRefresh={load}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum filme encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={3} style={styles.cardBody}>
                {item.overview}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "#666" },

  input: {
    margin: 16,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderColor: "#DDD",
    borderWidth: StyleSheet.hairlineWidth,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    borderColor: "#EEE",
    borderWidth: StyleSheet.hairlineWidth,
  },
  poster: { width: 80, height: 120, borderRadius: 8, marginRight: 12 },
  cardTitle: { fontWeight: "700", marginBottom: 4, fontSize: 16 },
  cardBody: { color: "#444" },
});
