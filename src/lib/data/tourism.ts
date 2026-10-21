import type { TourismFeature, TourismStep, TourismComparison, TourismPackage, TourismPlace } from "./types";
import { loadContent } from "../api";

export const getTourismFeatures = () => loadContent<TourismFeature>("tourismFeatures");
export const getTourismRoadmap = () => loadContent<TourismStep>("tourismRoadmap");
export const getTourismComparison = () => loadContent<TourismComparison>("tourismComparison");
export const getTourismPackages = () => loadContent<TourismPackage>("tourismPackages");
export const getTourismPlaces = () => loadContent<TourismPlace>("tourismPlaces");
