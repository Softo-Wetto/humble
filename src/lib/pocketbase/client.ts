"use client";
import { pbRequest } from "./http";
export function clientRequest<T>(path: string, options: RequestInit = {}) { return pbRequest<T>(path, options); }
