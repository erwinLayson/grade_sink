type Student = {
    studentId: number;
    fullName: string;
    className: string;
    classSection: string;
    schoolLevel?: string | null;
    LRN: string | null;
    sex: string | null;
    age: number | null;
    subjects: {
        name: string;
        grades: number | null;
        quarter: number | null;
    }[];
};
export default function generateGradePDF(result: Student[]): string;
export {};
//# sourceMappingURL=generateGrade.pdf.d.ts.map