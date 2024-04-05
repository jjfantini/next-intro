import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function Quiz({ id, searchParams }: { id: string, searchParams: { show?: string } }) {
  let answers = await sql`
    SELECT
      q.quiz_id,
      q.title AS quiz_title,
      q.description AS quiz_description,
      q.question_text AS quiz_question,
      a.answer_id,
      a.answer_text,
      a.is_correct
    FROM quizzes AS q
    JOIN answers AS a ON q.quiz_id = a.quiz_id
    WHERE q.quiz_id = ${id};
  `;

  return (
    <div>
      <h1 className="text-2xl font-bold">{answers[0].quiz_title}</h1>
      <p className="text-lg text-gray-500">{answers[0].quiz_description}</p>
      <p className="text-lg my-4">{answers[0].quiz_question}</p>
      <ul>
        {answers.map((answer) => (
          <li key={answer.answer_id}>
            <p>
              {answer.answer_text}
              {searchParams.show === "true" && answer.is_correct && "Correct"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuizPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show?: string };
}) {
  return (
    <section>
      <Quiz id={params.id} searchParams={searchParams} />
      <form
        action={async () => {
          "use server";
          redirect(`/quiz/${params.id}?show=True`);
        }}
      >
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all">
          Show Answer
        </button>
      </form>
    </section>
  );
}
