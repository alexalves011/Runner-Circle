import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import BottomNavigation from "../components/layout/BottomNavigation";
import WorkoutCard from "../components/ui/WorkoutCard";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { useMutation, useQuery } from "@apollo/client";
import ErroMessage from "../components/ui/ErrorMessage";
import {
  GET_FEED,
  GET_FEED_BY_CATEGORY,
} from "../../database/graphql/query/Feed";
import Dropdown from "../components/ui/Dropdown";
import { DELETE_FEED_POST } from "../../database/graphql/Mutation/feed";

function Feed({ onNavigateToNewPost, onNavigateToProfile, onLogout }) {
  const [activeItem, setActiveItem] = useState("feed");
  const [workouts, setWorkouts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { loading, error, data } = useQuery(
    selectedCategory ? GET_FEED_BY_CATEGORY : GET_FEED,
    {
      variables: selectedCategory ? { category: selectedCategory } : {},
    },
  );

  const [deleteFeedPost] = useMutation(DELETE_FEED_POST, {
    refetchQueries: [{ query: GET_FEED }, { query: GET_FEED_BY_CATEGORY }],
    update: (cache, { data: { deleteFeed } }) => {
      try {
        const existingFeed = cache.readQuery({ query: GET_FEED });
        if (existingFeed) {
          cache.writeQuery({
            query: GET_FEED,
            data: {
              feed: existingFeed.feed.filter(
                (post) => post.id === deleteFeed.id,
              ),
            },
          });
        }
      } catch (error) {
        console.log("cache update error", error);
      }

      try {
        const existingCategoryFeed = cache.readQuery({
          query: GET_FEED_BY_CATEGORY,
          variables: { category: deleteFeed.category },
          data: {
            feedByCategory: existingCategoryFeed.feedByCategory.filter(
              (post) => post.id !== deleteFeed.id,
            ),
          },
        });
      } catch (error) {
        console.log("Category cache update error:", error);
      }
    },
  });

  useEffect(() => {
    // Adicionado "data &&" para evitar erros se "data" ainda for undefined no carregamento
    if (data && data.allFeeds) {
      const fetchWorkouts = async () => {
        const normalizedWorkouts = data.allFeeds.map((item) => {
          if (item.workout) {
            setWorkouts(data.allFeeds);
          }
          return item;
        });
        setWorkouts(normalizedWorkouts);
      };

      fetchWorkouts();
    }
  }, [data]);

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    console.log("Menu clicked:", itemId);

    if (itemId === "profile") {
      onNavigateToProfile?.();
    } else if (itemId === "logout") {
      onLogout?.();
    }
  };

  const handleDelete = (id) => {
    deleteFeedPost({variables: {id}})
  };

  const categoryOptions = [
    { value: "", label: "todos" },
    { value: "caminhada", label: "caminhada" },
    { value: "corrida", label: "corrida" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="md:flex">
        {/* Desktop Sidebar */}
        <Sidebar activeItem={activeItem} onItemClick={handleMenuClick} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-graphite mb-6 hidden md:block">
              Feed de Treinos
            </h1>

            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Selecione uma Categoria"
              className="mb-6"
            />

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Carregando treinos...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <ErroMessage
                message="Erro ao carregar treinos"
                error={error.message}
              />
            )}

            {/* Workout Cards Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {workouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeItem={activeItem} onItemClick={handleMenuClick} />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={onNavigateToNewPost} />
    </div>
  );
} // <- Esta chave que fecha a função Feed estava faltando no seu código anterior

export default Feed;
