'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import * as Y from 'yjs';

interface UseCollaborationOptions {
  documentId: string;
  wsUrl?: string;
}

interface UserPresence {
  clientId: number;
  user: {
    name: string;
    color: string;
  };
}

interface YPartyKitProvider {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  awareness: {
    on: (event: string, callback: () => void) => void;
    getStates: () => Map<number, { user?: UserPresence['user'] }>;
    setLocalStateField: (field: string, value: unknown) => void;
  };
  destroy: () => void;
}

// Random user colors
const COLORS = ['#f783ac', '#748ffc', '#69db7c', '#ffa94d', '#7950f2', '#0c8599'];
const getRandomUser = () => ({
  name: `User ${Math.floor(Math.random() * 1000)}`,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

export function useCollaboration({
  documentId,
}: UseCollaborationOptions) {
  const ydocRef = useRef<Y.Doc | null>(null);
  const [yText, setYText] = useState<Y.Text | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const providerRef = useRef<YPartyKitProvider | null>(null);
  const awarenessRef = useRef<YPartyKitProvider['awareness'] | null>(null);

  // Set user info function
  const setUserInfo = useCallback((name: string, color: string) => {
    if (awarenessRef.current) {
      awarenessRef.current.setLocalStateField('user', { name, color });
    }
  }, []);

  useEffect(() => {
    // Create Y.Doc only once
    if (!ydocRef.current) {
      ydocRef.current = new Y.Doc();
    }
    const ydoc = ydocRef.current;

    const ytext = ydoc.getText('codemirror');
    setYText(ytext);

    // Dynamic import for client-side only
    import('y-partykit/provider').then((mod) => {
      // YPartyKitProvider is exported as default
      type ProviderClass = new (host: string, room: string, doc: Y.Doc) => YPartyKitProvider;
      const YPartyKitProvider = mod.default as unknown as ProviderClass;
      const host = 'collab-md.markj81.partykit.dev';
      const provider = new YPartyKitProvider(host, documentId, ydoc);
      providerRef.current = provider;
      awarenessRef.current = provider.awareness;

      // Set random user info
      const user = getRandomUser();
      provider.awareness.setLocalStateField('user', user);

      provider.on('sync', (synced: unknown) => {
        setIsConnected(synced as boolean);
      });

      provider.awareness.on('change', () => {
        const states = provider.awareness.getStates();
        const userList: UserPresence[] = [];
        states.forEach((state, clientId) => {
          if (state.user) {
            userList.push({
              clientId,
              user: state.user,
            });
          }
        });
        setUsers(userList);
      });
    });

    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
        awarenessRef.current = null;
      }
    };
  }, [documentId]);

  return {
    ydoc: ydocRef.current,
    yText,
    isConnected,
    users,
    setUserInfo,
  };
}