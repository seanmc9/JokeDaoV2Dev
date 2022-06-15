import { Fragment, useState } from "react";
import shallow from "zustand/shallow";
import { useRouter } from "next/router";
import Link from "next/link";
import { useNetwork } from "wagmi";
import { isDate, isWithinInterval } from "date-fns";
import { Transition } from "@headlessui/react";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/solid";
import { CalendarIcon, ClipboardListIcon, DocumentDownloadIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTEST, ROUTE_VIEW_CONTEST_RULES } from "@config/routes";
import { chains } from "@config/wagmi";
import { useStore, useContest, Provider, createStore } from "@hooks/useContest";
import Button from "@components/Button";
import Loader from "@components/Loader";
import DialogModal from "@components/DialogModal";
import { getLayout as getBaseLayout } from "./../LayoutBase";
import Timeline from "./Timeline";
import VotingToken from "./VotingToken";
import styles from "./styles.module.css";
import button from "@components/Button/styles";

const LayoutViewContest = (props: any) => {
  const { children } = props;
  const { query, pathname } = useRouter();
  const { activeChain, switchNetwork } = useNetwork();
  const { asPath } = useRouter();
  const [url] = useState(asPath.split("/"));
  const [chainId] = useState(chains.filter(chain => chain.name.toLowerCase() === url[2])?.[0]?.id);
  const { isLoading, isSuccess, isError, retry, errors } = useContest();
  const { submissionsOpen, votesOpen, votesClose, contestName, contestAuthor } = useStore(
    state => ({
      //@ts-ignore
      contestName: state.contestName,
      //@ts-ignore
      contestAuthor: state.contestAuthor,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
    }),
    shallow,
  );

  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  return (
    <div className="flex-grow container mx-auto relative md:grid md:gap-6  md:grid-cols-12">
      <div
        className={`${styles.navbar} ${styles.withFakeSeparator} z-10 justify-center md:justify-start md:pie-3 border-neutral-4 md:border-ie md:overflow-y-auto sticky inline-start-0 top-0 bg-true-black py-2 md:pt-0 md:mt-5 md:pb-10 md:h-full md:max-h-[calc(100vh-4rem)] md:col-span-4`}
      >
        <nav className={`${styles.navbar} md:space-y-1 `}>
          <Link
            href={{
              pathname: ROUTE_VIEW_CONTEST,
              //@ts-ignore
              query: {
                chain: query.chain,
                address: query.address,
              },
            }}
          >
            <a
              className={`${styles.navLink} ${
                [ROUTE_VIEW_CONTEST, ROUTE_CONTEST_PROPOSAL].includes(pathname) ? styles["navLink--active"] : ""
              }`}
            >
              <HomeIcon className={styles.navLinkIcon} /> Contest
            </a>
          </Link>
          <Link
            href={{
              pathname: ROUTE_VIEW_CONTEST_RULES,
              //@ts-ignore
              query: {
                chain: query.chain,
                address: query.address,
              },
            }}
          >
            <a
              className={`${styles.navLink} ${pathname === ROUTE_VIEW_CONTEST_RULES ? styles["navLink--active"] : ""}`}
            >
              <ClipboardListIcon className={styles.navLinkIcon} />
              Rules
            </a>
          </Link>
        </nav>

        <button
          disabled={isLoading || isError || activeChain?.id !== chainId}
          className={`md:mt-1 md:mb-3 ${
            isLoading || isError || activeChain?.id !== chainId ? "opacity-50 cursor-not-allowed" : ""
          } ${styles.navLink}`}
        >
          <DocumentDownloadIcon className={styles.navLinkIcon} />
          Export data
        </button>
        {isDate(submissionsOpen) &&
          isDate(votesOpen) &&
          isWithinInterval(new Date(), {
            start: submissionsOpen,
            end: votesOpen,
          }) && (
            <Button
              className="animate-appear fixed md:static z-10 aspect-square 2xs:aspect-auto bottom-16 inline-end-5 md:bottom-unset md:inline-end-unset"
              disabled={isLoading || isError || activeChain?.id !== chainId}
            >
              <PaperAirplaneIcon className="w-5 2xs:w-6 rotate-45 2xs:mie-0.5 -translate-y-0.5 md:hidden" />
              <span className="sr-only 2xs:not-sr-only">Submit</span>
            </Button>
          )}
        <Button
          onClick={() => setIsTimelineModalOpen(true)}
          disabled={
            isLoading ||
            isError ||
            activeChain?.id !== chainId ||
            !isDate(submissionsOpen) ||
            !isDate(votesOpen) ||
            !isDate(votesClose)
          }
          intent="true-solid-outline"
          className={`
          ${
            !isDate(submissionsOpen) ||
            !isDate(votesOpen) ||
            !isWithinInterval(new Date(), {
              start: submissionsOpen,
              end: votesOpen,
            })
              ? "bottom-16"
              : "bottom-32"
          }
          animate-appear fixed md:static md:hidden z-10 aspect-square 2xs:aspect-auto 2xs:bottom-[7.5rem] inline-end-5 md:bottom-unset md:inline-end-unset`}
        >
          <CalendarIcon className="w-5 2xs:mie-1 md:hidden" />
          <span className="sr-only 2xs:not-sr-only">Timeline</span>
        </Button>
        {!isLoading &&
          isSuccess &&
          activeChain?.id === chainId &&
          isDate(submissionsOpen) &&
          isDate(votesOpen) &&
          isDate(votesClose) && (
            <>
              <div className="hidden md:my-4 md:block">
                <VotingToken />
              </div>
              <div className="hidden md:block">
                <Timeline />
              </div>
            </>
          )}
      </div>
      <div className="md:pt-5 flex flex-col md:col-span-8">
        <Transition
          show={activeChain?.id !== chainId}
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex text-center flex-col mt-10 mx-auto">
            <p className="font-bold text-lg">Looks like you&apos;re using the wrong network.</p>
            <p className="mt-2 mb-4 text-neutral-11 text-xs">You need to use {url[2]} to check this contest.</p>
            <Button
              onClick={() => {
                switchNetwork?.(chainId);
              }}
              className="mx-auto"
            >
              Switch network
            </Button>
          </div>
        </Transition>
        <Transition
          show={activeChain?.id === chainId && isLoading && !isSuccess && !isError}
          as={Fragment}
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <div>
            <Loader scale="page" />
          </div>
        </Transition>
        <Transition
          show={activeChain?.id === chainId && isError}
          as={Fragment}
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <div className="flex flex-col">
            <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
              <p className="text-sm font-bold text-negative-10 text-center">
                Something went wrong while fetching this contest.
              </p>
            </div>
            <Button
              onClick={() => retry()}
              className="mt-5 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
              intent="neutral-outline"
            >
              Try again
            </Button>
          </div>
        </Transition>
        <Transition
          show={activeChain?.id === chainId && isSuccess && !isLoading}
          as={Fragment}
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <div className="pt-3 md:pt-0">
            {pathname === ROUTE_CONTEST_PROPOSAL && (
              <div>
                <Link
                  href={{
                    pathname: ROUTE_VIEW_CONTEST,
                    //@ts-ignore
                    query: {
                      chain: query.chain,
                      address: query.address,
                    },
                  }}
                >
                  <a className="text-neutral-12 hover:text-opacity-75 focus:underline flex items-center mb-2 text-2xs">
                    <ArrowLeftIcon className="mie-1 w-4" />
                    Back to contest
                  </a>
                </Link>
              </div>
            )}
            <h2 className="flex flex-wrap items-baseline text-neutral-11 font-bold mb-4">
              <span className="uppercase tracking-wide pie-1ex">{contestName}</span>{" "}
              <span className="text-xs overflow-hidden text-neutral-8 text-ellipsis">by {contestAuthor}</span>
            </h2>
            {children}

            <DialogModal isOpen={isTimelineModalOpen} setIsOpen={setIsTimelineModalOpen} title="Contest timeline">
              {!isLoading &&
                isSuccess &&
                activeChain?.id === chainId &&
                isDate(submissionsOpen) &&
                isDate(votesOpen) &&
                isDate(votesClose) && (
                  <>
                    <h3 className="text-lg text-neutral-12 mb-3 font-black">{contestName} - timeline</h3>
                    <div className="mb-2">
                      <VotingToken />
                    </div>
                    <Timeline />
                  </>
                )}
            </DialogModal>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export const getLayout = (page: any) => {
  return getBaseLayout(
    <Provider createStore={createStore}>
      <LayoutViewContest>{page}</LayoutViewContest>
    </Provider>,
  );
};