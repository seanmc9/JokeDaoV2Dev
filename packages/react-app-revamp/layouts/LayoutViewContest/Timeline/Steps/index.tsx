import shallow from "zustand/shallow";
import { format } from "date-fns";
import { useStore } from "@hooks/useContest/store";
import styles from "./styles.module.css";
import { CONTEST_STATUS } from "@helpers/contestStatus";
// - Contest status
// 0: Voting open
// 1: Contest cancelled
// 2: Submissions open
// 3: Completed

export const Steps = () => {
  const { submissionsOpen, votesOpen, votesClose, contestStatus } = useStore(
    state => ({
      //@ts-ignore
      contestStatus: state.contestStatus,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
    }),
    shallow,
  );

  return (
    <ol
      className={`${styles.stepper} ${
        contestStatus === CONTEST_STATUS.COMPLETED ? styles.stepperCompleted : styles.stepperNotCompleted
      } relative md:text-xs flex pb-3 mt-3 space-y-4 flex-col`}
      style={{
        // @ts-ignore
        "--stepperLineIndicatorHeight": `${
          contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN
            ? "33"
            : contestStatus === CONTEST_STATUS.CANCELLED || contestStatus === CONTEST_STATUS.SUBMISSIONS_NOT_OPEN
            ? "0"
            : "66"
        }%`,
      }}
    >
      <li
        className={`${styles.step} ${
          contestStatus === CONTEST_STATUS.CANCELLED || contestStatus === CONTEST_STATUS.SUBMISSIONS_NOT_OPEN
            ? "text-neutral-11"
            : contestStatus === CONTEST_STATUS.COMPLETED
            ? "text-secondary-11"
            : "text-positive-10"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-bold">{format(submissionsOpen, "PPP p")}</span> <span>Submissions open</span>
        </div>
      </li>
      <li
        className={`${styles.step} ${
          contestStatus === CONTEST_STATUS.VOTING_OPEN
            ? "text-positive-10"
            : contestStatus === CONTEST_STATUS.COMPLETED
            ? "text-secondary-11"
            : "text-neutral-11"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-bold">{format(votesOpen, "PPP p")}</span> <span>voting opens</span>
        </div>
      </li>
      <li
        className={`${styles.step} ${
          contestStatus === CONTEST_STATUS.COMPLETED ? "text-secondary-11" : "text-neutral-11"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-bold">{format(votesClose, "PPP p")}</span> <span>voting closes</span>
        </div>
      </li>
    </ol>
  );
};

export default Steps;
