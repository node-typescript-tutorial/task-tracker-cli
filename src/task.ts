export interface Task {
    id: string;
    description: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}

export type STATUS = "to-do"|"in-progress" | "done" | "cancel" | "outdated"