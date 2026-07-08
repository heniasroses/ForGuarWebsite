"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";
import styles from "./AdminAlmanac.module.css";

type WildlifeEntry = {
  id: string;
  common_name: string;
  scientific_name: string;
  habitat: string;
  population: string | number | null;
  conservation_status: string;
  description: string;
  mainImage_url: string | null;
};

type ModalMode = "create" | "edit";

const EMPTY_ENTRY: WildlifeEntry = {
  id: "",
  common_name: "",
  scientific_name: "",
  habitat: "",
  population: "",
  conservation_status: "",
  description: "",
  mainImage_url: "",
};

export default function AdminAlmanac() {
  const router = useRouter();
  const pathname = usePathname();

  const [entries, setEntries] = useState<WildlifeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedEntry, setSelectedEntry] = useState<WildlifeEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("wildlife_entries")
        .select("*")
        .order("common_name", { ascending: true });

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setEntries((data || []) as WildlifeEntry[]);
      setLoading(false);
    };

    init();
  }, [router]);

  const deleteEntry = async (id: string) => {
    const confirmed = confirm("Delete this wildlife entry?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("wildlife_entries")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed");
      return;
    }

    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const openEditModal = (entry: WildlifeEntry) => {
    setSelectedEntry({ ...entry });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedEntry({ ...EMPTY_ENTRY });
    setModalMode("create");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  const saveEntry = async () => {
    if (!selectedEntry) return;

    setSaving(true);

    const payload = {
      common_name: selectedEntry.common_name,
      scientific_name: selectedEntry.scientific_name,
      habitat: selectedEntry.habitat,
      population:
        selectedEntry.population === "" ? null : selectedEntry.population,
      conservation_status: selectedEntry.conservation_status,
      description: selectedEntry.description,
      mainImage_url: selectedEntry.mainImage_url?.trim()
        ? selectedEntry.mainImage_url
        : null,
    };

    if (modalMode === "create") {
      const { error, data } = await supabase
        .from("wildlife_entries")
        .insert([payload])
        .select()
        .single();

      if (error) {
        alert("Create failed");
        setSaving(false);
        return;
      }

      setEntries((prev) => [data as WildlifeEntry, ...prev]);
      setSaving(false);
      closeModal();
      return;
    }

    const { error, data } = await supabase
      .from("wildlife_entries")
      .update(payload)
      .eq("id", selectedEntry.id)
      .select()
      .single();

    if (error) {
      alert("Update failed");
      setSaving(false);
      return;
    }

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === selectedEntry.id ? (data as WildlifeEntry) : entry
      )
    );

    setSaving(false);
    closeModal();
  };

  const statusOptions = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.conservation_status))).filter(
      Boolean
    );
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = search.toLowerCase().trim();

    return entries.filter((entry) => {
      const matchesFilter =
        filter === "all" ? true : entry.conservation_status === filter;

      const matchesSearch =
        q.length === 0 ||
        entry.common_name.toLowerCase().includes(q) ||
        entry.scientific_name.toLowerCase().includes(q) ||
        entry.habitat.toLowerCase().includes(q) ||
        entry.conservation_status.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [entries, filter, search]);

  return (
    <>
      <AdminNavbar />

      <div className="adminContainer">
        <div className="adminSidebar">
          <h3
            className={`adminSidebarItem ${
              pathname.includes("/admin") && !pathname.includes("/admin/almanac")
                ? "activeSidebar"
                : ""
            }`}
            onClick={() => router.push("/admin")}
          >
            Forest Logs
          </h3>

          <h3
            className={`adminSidebarItem ${
              pathname.includes("/admin/almanac") ? "activeSidebar" : ""
            }`}
            onClick={() => router.push("/admin/almanac")}
          >
            Almanac
          </h3>
        </div>

        <div className="adminMain adminAlmanac">
          <div className={styles.filterSection}>

            <div className={styles.filterTop}>

                <input
                type="text"
                placeholder="Search wildlife..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                />

                <button
                onClick={openCreateModal}
                className={styles.createButton}
                >
                + Create Entry
                </button>

            </div>

            <div className={styles.filterBottom}>

                <button
                className={`ForGuarButtons ${
                    filter === "all" ? "activeFilterAdmin" : ""
                }`}
                onClick={() => setFilter("all")}
                >
                All Statuses
                </button>

                {statusOptions.map((status) => (
                <button
                    key={status}
                    className={`ForGuarButtons ${
                    filter === status ? "activeFilterAdmin" : ""
                    }`}
                    onClick={() => setFilter(status)}
                >
                    {status}
                </button>
                ))}

            </div>

            </div>

          {loading ? (
            <p style={{ color: "white" }}>Loading...</p>
          ) : filteredEntries.length === 0 ? (
            <p style={{ color: "white" }}>No wildlife entries found.</p>
          ) : (
            <div className="adminGrid">
              {filteredEntries.map((entry) => (
                <div className="adminCard" key={entry.id}>
                  {entry.mainImage_url && (
                    <img
                      src={entry.mainImage_url}
                      alt={entry.common_name}
                      className={styles.cardImage}
                    />
                  )}

                  <h2>{entry.common_name}</h2>
                  <p className="adminUser">{entry.scientific_name}</p>
                  <p className="adminCategory">{entry.conservation_status}</p>

                  <div className="adminButtons">
                    <button
                      className="viewBtn"
                      onClick={() => openEditModal(entry)}
                    >
                      View
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedEntry && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === "create"
                  ? "Create Wildlife Entry"
                  : "Edit Almanac Entry"}
              </h2>

              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            <div className={styles.form}>
              <label className={styles.field}>
                <span>Common Name</span>
                <input
                  type="text"
                  value={selectedEntry.common_name}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      common_name: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span>Scientific Name</span>
                <input
                  type="text"
                  value={selectedEntry.scientific_name}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      scientific_name: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span>Habitat</span>
                <input
                  type="text"
                  value={selectedEntry.habitat}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      habitat: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span>Population</span>
                <input
                  type="text"
                  value={selectedEntry.population ?? ""}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      population: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span>Conservation Status</span>
                <input
                  type="text"
                  value={selectedEntry.conservation_status}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      conservation_status: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span>Main Image URL</span>
                <input
                  type="text"
                  value={selectedEntry.mainImage_url ?? ""}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      mainImage_url: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <textarea
                  value={selectedEntry.description}
                  onChange={(e) =>
                    setSelectedEntry({
                      ...selectedEntry,
                      description: e.target.value,
                    })
                  }
                  rows={8}
                  className={styles.textarea}
                />
              </label>

              <div className={styles.actions}>
                <button
                  onClick={saveEntry}
                  disabled={saving}
                  className={styles.saveButton}
                >
                  {saving
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Create Entry"
                    : "Save Changes"}
                </button>

                <button onClick={closeModal} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}