-- DropForeignKey
ALTER TABLE "routines" DROP CONSTRAINT "routines_sub_exam_category_id_fkey";

-- DropForeignKey
ALTER TABLE "syllabuses" DROP CONSTRAINT "syllabuses_sub_exam_category_id_fkey";

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "syllabuses" ADD CONSTRAINT "syllabuses_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
