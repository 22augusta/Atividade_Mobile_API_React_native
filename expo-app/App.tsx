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
import { API_KEY, API_BASE } from "@env";

type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
};

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState("");
    const [endpoint, setEndpoint] = useState<string | null>(null);

    async function load() {
        if (!API_BASE || !API_KEY) {
            console.error("API_BASE or API_KEY missing in .env");
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            setRefreshing(true);
            const q = query ? `&query=${encodeURIComponent(query)}` : "";
            const url = query
                ? `${API_BASE}/search/movie?api_key=${API_KEY}&language=pt-BR${q}`
                : `${API_BASE}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
            setEndpoint(url);

            const res = await fetch(url);
            if (!res.ok) {
                console.error("TMDB error", res.status);
                setMovies([]);
                return;
            }
            const data = await res.json();
            setMovies(data.results || []);
        } catch (err) {
            console.error("Erro ao buscar filmes:", err);
            setMovies([]);
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

    const filtered = query
        ? movies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
        : movies;

    return (
        <SafeAreaView style={styles.container}>
            {endpoint ? <Text style={styles.endpoint}>Endpoint: {endpoint}</Text> : null}
            <TextInput
                placeholder="Buscar por título..."
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                onRefresh={load}
                refreshing={refreshing}
                ListEmptyComponent={<Text style={styles.muted}>Nenhum resultado.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {item.poster_path ? (
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                                style={styles.poster}
                            />
                        ) : (
                            <View style={[styles.poster, { backgroundColor: "#DDD", justifyContent: "center", alignItems: "center" }]}>
                                <Text style={{ color: "#666", fontSize: 12 }}>Sem imagem</Text>
                            </View>
                        )}

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
    endpoint: { fontSize: 12, color: '#666', marginHorizontal: 16, marginTop: 8 },
});
