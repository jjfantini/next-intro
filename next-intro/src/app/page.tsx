import Link from "next/link";
import postgres from "postgres";
import { Suspense } from "react";
import styles from "./home.module.css";
import QuizForm from "./quiz-form";

const sql = postgres(process.env.DATABASE_URL!);

type Quiz = {
  quiz_id: number;
  title: string;
  description: string;
  question_text: string;
  created_at: string;
};

async function Quizzes() {
  const quizzes: Quiz[] = await sql`SELECT quiz_id, title, description, question_text, created_at FROM quizzes`;
  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id} className="underline">
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <section>
      <h1 className={styles.title}>All Quizzes</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Quizzes />
        <QuizForm />
      </Suspense>
    </section>
  );
}
