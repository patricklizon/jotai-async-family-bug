import { atom, useAtomValue } from "jotai";
import { atomFamily, loadable } from "jotai/utils";
import { StrictMode, Suspense, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";

import "./styles/app.css";
import "./styles/reset.css";

const node = document.getElementById("root");
if (!node) throw new Error("Root element does not exist");

const peopleFamilyAtom = atomFamily(
  (param: { id: number }) => {
    return atom(async () => {
      return (
        await fetch(`https://swapi.dev/api/people/${param.id}`)
      ).json() as Promise<{ name: string }>;
    });
  },
  (a, b) => a.id === b.id
);

/**
 *
 * NOT WORKING
 */
function LoadableComponent(): JSX.Element {
  const loadableExample = useAtomValue(loadable(peopleFamilyAtom({ id: 1 })));

  useEffect(() => {
    console.log({ loadableExample });
  }, [loadableExample]);

  switch (loadableExample.state) {
    case "hasError": {
      return <div>error</div>;
    }
    case "loading": {
      return <div>loading - loadable</div>;
    }
    case "hasData": {
      return <div>hasData - loadable</div>;
    }
  }
}

/**
 *
 * WORKING
 */
function LoadableWithMemo(): JSX.Element {
  const atomConfig = useMemo(() => peopleFamilyAtom({ id: 2 }), []);
  const loadableWithMemoExample = useAtomValue(loadable(atomConfig));

  useEffect(() => {
    console.log({ loadableWithMemoExample });
  }, [loadableWithMemoExample]);

  switch (loadableWithMemoExample.state) {
    case "hasError": {
      return <div>error</div>;
    }
    case "loading": {
      return <div>loading - loadable with memo</div>;
    }
    case "hasData": {
      return (
        <div>
          hasData - loadable with memo -{" "}
          <strong>{loadableWithMemoExample.data.name}</strong>
        </div>
      );
    }
  }
}

/**
 *
 * NOT WORKING
 */
function SuspendedComponent(): null {
  const suspendedExample = useAtomValue(peopleFamilyAtom({ id: 3 }));

  useEffect(() => {
    console.log({ suspendedExample });
  }, [suspendedExample]);

  return null;
}

/**
 *
 * NOT WORKING
 */
function SuspenseComponentWithMemo(): null {
  const atomConfig = peopleFamilyAtom({ id: 4 });
  const suspendedWithMemoExample = useAtomValue(atomConfig);

  useEffect(() => {
    console.log({ suspendedWithMemoExample });
  }, [suspendedWithMemoExample]);

  return null;
}

const root = createRoot(node);

root.render(
  <StrictMode>
    <LoadableComponent />

    <LoadableWithMemo />

    <Suspense fallback={<div>loading suspended</div>}>
      <SuspendedComponent />
    </Suspense>

    <Suspense fallback={<div>loading with memo</div>}>
      <SuspenseComponentWithMemo />
    </Suspense>
  </StrictMode>
);
