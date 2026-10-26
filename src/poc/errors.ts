export class ClassroomError extends Error {
  constructor(public readonly reason: string) { super(reason); }
}
