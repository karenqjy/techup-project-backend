-- CreateTable
/*CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);*/
CREATE TABLE competency_questions (
    "id" SERIAL NOT NULL,
    "competency" VARCHAR(255) NOT NULL,
    "proficiency" VARCHAR(10) NOT NULL,
    "question_type" VARCHAR(10) NOT NULL,
    "question_text" TEXT NOT NULL,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

