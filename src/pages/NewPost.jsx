import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import BottomNavigation from "../components/layout/BottomNavigation";
import NewPostForm from "../components/forms/NewPostForm";
import { useMutation } from "@apollo/client";
import { ADD_FEED_POST } from "../../database/graphql/Mutation/feed";
import {
  GET_FEED,
  GET_FEED_BY_CATEGORY,
} from "../../database/graphql/query/feed";

function NewPost({ onNavigateToFeed }) {
  const [addFeedPost, { loading: savingPost }] = useMutation(ADD_FEED_POST, {
    refetchQueries: [{ query: GET_FEED }, { query: GET_FEED_BY_CATEGORY }],
  });

  const handleSubmit = async (formData) => {
    try {
      const formParam = {
        user: {
          id: 1,
          name: "Pedro Melo",
        },
        time: parseInt(formData.tempo) * 60,
        stats: {
          distance: formData.distancia + " Km", // Ajustado para bater com '2 Km' do seu banco de dados
          calories: formData.calories + " Kcal", // Ajustado para bater com '300 Kcal' do seu banco de dados
          heartRate: formData.heartRate + " BPM", // Ajustado para bater com '120 BPM' do seu banco de dados
        },
        workout: formData.tipoTreino, // <-- Enviando como 'category' (String) diretamente para a Mutation
        description: formData.descricao,
        timestamp: new Date().toISOString(),
      };

      await addFeedPost({ variables: formParam });
      onNavigateToFeed?.();
    } catch (error) {
      console.error("Erro ao salvar treino", error);
    }
  };

  // <-- 2. FALTAVA ESSA CHAVE PARA FECHAR O handleSubmit!

  const handleCancel = () => {
    onNavigateToFeed?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar activeItem="feed" />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <NewPostForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={savingPost}
            />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeItem="feed" />
    </div>
  );
}

export default NewPost;
