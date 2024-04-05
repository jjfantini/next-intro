export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <section>
      <h1>Quiz {params.id} Page</h1>
    </section>
  );
}

