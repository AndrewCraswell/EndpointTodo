import { ActionPattern, ActionMatchingPattern } from "@redux-saga/types";
import { ForkEffect } from "redux-saga/effects";

export type EffectCreator = <P extends ActionPattern>(pattern: P, worker: (action: ActionMatchingPattern<P>) => any) => ForkEffect;
