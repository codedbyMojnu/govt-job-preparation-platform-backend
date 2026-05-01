-- DropForeignKey
ALTER TABLE "question_sets" DROP CONSTRAINT "question_sets_sub_exam_category_id_fkey";

-- AddForeignKey
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
