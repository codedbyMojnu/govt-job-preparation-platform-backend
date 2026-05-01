-- DropForeignKey
ALTER TABLE "sub_exam_categories" DROP CONSTRAINT "sub_exam_categories_exam_category_id_fkey";

-- AddForeignKey
ALTER TABLE "sub_exam_categories" ADD CONSTRAINT "sub_exam_categories_exam_category_id_fkey" FOREIGN KEY ("exam_category_id") REFERENCES "exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
