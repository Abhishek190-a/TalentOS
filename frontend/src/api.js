// TalentOS Centralized API Client
// Handles enterprise workforce intelligence requests, health checks,
// and manages local state fallback when the backend service is offline.

import axios from "axios";
import {
  MOCK_EMPLOYEES,
  MOCK_PROJECTS,
  MOCK_HIRING_REQUESTS,
  MOCK_CANDIDATES,
  getMockRecommendTeam,
  getMockWorkload,
  getMockRebalance,
  getMockRisks,
  getMockWhatIf,
  getMockBriefToTeam,
  getMockAgentChat
} from "./mockData.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 3500,
  headers: {
    "Content-Type": "application/json"
  }
});

// Connectivity state management
let isLiveApi = false;
let forceDemoMode = false;
const listeners = new Set();

export function setConnectionState(live) {
  if (isLiveApi !== live) {
    isLiveApi = live;
    notifyListeners();
  }
}

export function setForceDemoMode(force) {
  forceDemoMode = force;
  notifyListeners();
}

export function getConnectionStatus() {
  return {
    isLive: isLiveApi && !forceDemoMode,
    isForceDemo: forceDemoMode,
    baseUrl: BASE_URL
  };
}

export function subscribeConnectionStatus(callback) {
  listeners.add(callback);
  callback(getConnectionStatus());
  return () => listeners.delete(callback);
}

function notifyListeners() {
  const status = getConnectionStatus();
  listeners.forEach((cb) => {
    try {
      cb(status);
    } catch (err) {
      console.error("Connection listener error:", err);
    }
  });
}

// Quick health check
export async function checkBackendHealth() {
  if (forceDemoMode) return false;
  try {
    const res = await apiClient.get("/health", { timeout: 2000 });
    const success = res.status === 200;
    setConnectionState(success);
    return success;
  } catch {
    setConnectionState(false);
    return false;
  }
}

// 1. GET /employees
export async function getEmployees() {
  if (forceDemoMode) return { data: MOCK_EMPLOYEES, isLive: false };
  try {
    const res = await apiClient.get("/employees");
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: MOCK_EMPLOYEES, isLive: false, error: err.message };
  }
}

// 2. GET /projects
export async function getProjects() {
  if (forceDemoMode) return { data: MOCK_PROJECTS, isLive: false };
  try {
    const res = await apiClient.get("/projects");
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: MOCK_PROJECTS, isLive: false, error: err.message };
  }
}

// 3. POST /team/recommend
export async function recommendTeam(projectId = "P001", mode = "optimized") {
  if (forceDemoMode) {
    return { data: getMockRecommendTeam(projectId, mode), isLive: false };
  }
  try {
    const res = await apiClient.post("/team/recommend", {
      project_id: projectId,
      mode: mode
    });
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return {
      data: getMockRecommendTeam(projectId, mode),
      isLive: false,
      error: err.message
    };
  }
}

// 4. GET /workload
export async function getWorkload() {
  if (forceDemoMode) return { data: getMockWorkload(), isLive: false };
  try {
    const res = await apiClient.get("/workload");
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: getMockWorkload(), isLive: false, error: err.message };
  }
}

// 5. POST /workload/rebalance
export async function rebalanceWorkload(payload = {}) {
  if (forceDemoMode) return { data: getMockRebalance(), isLive: false };
  try {
    const res = await apiClient.post("/workload/rebalance", payload);
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: getMockRebalance(), isLive: false, error: err.message };
  }
}

// 6. GET /risks
export async function getRisks() {
  if (forceDemoMode) return { data: getMockRisks(), isLive: false };
  try {
    const res = await apiClient.get("/risks");
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: getMockRisks(), isLive: false, error: err.message };
  }
}

// 7. POST /whatif
export async function runWhatIf(payload) {
  if (forceDemoMode) return { data: getMockWhatIf(payload), isLive: false };
  try {
    const res = await apiClient.post("/whatif", payload);
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: getMockWhatIf(payload), isLive: false, error: err.message };
  }
}

// 8. POST /brief-to-team
export async function briefToTeam(text) {
  if (forceDemoMode) return { data: getMockBriefToTeam(text), isLive: false };
  try {
    const res = await apiClient.post("/brief-to-team", { text });
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: getMockBriefToTeam(text), isLive: false, error: err.message };
  }
}

// 9. POST /agent/chat
export async function chatWithAgent(message) {
  if (forceDemoMode) return { data: getMockAgentChat(message), isLive: false };
  try {
    const res = await apiClient.post("/agent/chat", { message });
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch (err) {
    setConnectionState(false);
    return { data: getMockAgentChat(message), isLive: false, error: err.message };
  }
}

// ============================================================================
// HIRING & TALENT ACQUISITION (PROPOSED API SUPPORT & LOCAL APPLICATION STATE)
// ============================================================================

const LOCAL_STORAGE_KEY_HIRING = "talentos_hiring_requests_v1";

function getLocalHiringRequests() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HIRING);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return MOCK_HIRING_REQUESTS;
}

function saveLocalHiringRequests(requests) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_HIRING, JSON.stringify(requests));
  } catch {
    // ignore
  }
}

// 10. GET /hiring/requests [PROPOSED]
export async function getHiringRequests() {
  try {
    const res = await apiClient.get("/hiring/requests");
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch {
    return {
      data: getLocalHiringRequests(),
      isLive: false,
      source: "local_state"
    };
  }
}

// 11. POST /hiring/requests [PROPOSED]
export async function createHiringRequest(payload) {
  try {
    const res = await apiClient.post("/hiring/requests", payload);
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch {
    const current = getLocalHiringRequests();
    const newId = `REQ-${String(current.length + 1).padStart(3, "0")}`;
    const newReq = {
      ...payload,
      id: newId,
      status: payload.status || "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updated = [newReq, ...current];
    saveLocalHiringRequests(updated);
    return {
      data: newReq,
      isLive: false,
      source: "local_state"
    };
  }
}

// 12. PATCH /hiring/requests/{id} [PROPOSED]
export async function updateHiringRequestStatus(requestId, newStatus) {
  try {
    const res = await apiClient.patch(`/hiring/requests/${requestId}`, { status: newStatus });
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch {
    const current = getLocalHiringRequests();
    const updated = current.map((r) =>
      r.id === requestId
        ? { ...r, status: newStatus, updated_at: new Date().toISOString() }
        : r
    );
    saveLocalHiringRequests(updated);
    const item = updated.find((r) => r.id === requestId);
    return {
      data: item,
      isLive: false,
      source: "local_state"
    };
  }
}

// 13. POST /hiring/candidates/match [PROPOSED]
export async function getCandidateMatches(requestId) {
  try {
    const res = await apiClient.post("/hiring/candidates/match", { request_id: requestId });
    setConnectionState(true);
    return { data: res.data, isLive: true };
  } catch {
    return {
      data: {
        request_id: requestId,
        matched_count: MOCK_CANDIDATES.length,
        candidates: MOCK_CANDIDATES,
        notice: "Integration Preview: External ATS matching service pending backend deployment."
      },
      isLive: false,
      source: "local_preview"
    };
  }
}
