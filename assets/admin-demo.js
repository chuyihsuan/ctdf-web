(() => {
  const page = document.body;
  const path = page.dataset.adminPath || "";
  const authKey = "ctdf-admin-demo-auth";
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  const statusLabels = {
    draft: "草稿",
    review: "待審核",
    approved: "已核准匯出",
    scheduled: "已排程",
    published: "已發布",
    archived: "已封存"
  };

  const loginForm = document.querySelector("[data-login-form]");
  if (loginForm) {
    if (sessionStorage.getItem(authKey) === "active") {
      window.location.replace("/admin/");
      return;
    }
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(loginForm));
      if (values.account === "secretary" && values.password === "CTDF-DEMO") {
        sessionStorage.setItem(authKey, "active");
        const destination = new URLSearchParams(window.location.search).get("return");
        window.location.assign(destination?.startsWith("/admin/") ? destination : "/admin/");
        return;
      }
      document.querySelector("[data-login-error]").hidden = false;
    });
    return;
  }

  if (path.startsWith("admin") && sessionStorage.getItem(authKey) !== "active") {
    const destination = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
    window.location.replace(`/admin/login/?return=${destination}`);
    return;
  }

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    sessionStorage.removeItem(authKey);
    window.location.assign("/admin/login/");
  });

  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ctdf-admin-content", 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        const drafts = database.createObjectStore("drafts", { keyPath: "id" });
        drafts.createIndex("module", "module", { unique: false });
        database.createObjectStore("settings", { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  const databasePromise = openDatabase();

  async function databaseRequest(storeName, mode, operation) {
    const database = await databasePromise;
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const request = operation(transaction.objectStore(storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  const getDraft = (id) => databaseRequest("drafts", "readonly", (store) => store.get(id));
  const putDraft = (record) => databaseRequest("drafts", "readwrite", (store) => store.put(record));
  const getModuleDrafts = async (module) => {
    const database = await databasePromise;
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("drafts", "readonly");
      const request = transaction.objectStore("drafts").index("module").getAll(module);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const settingsForm = document.querySelector("[data-settings-form]");
  if (settingsForm) {
    databaseRequest("settings", "readonly", (store) => store.get("site")).then((saved) => {
      Object.entries(saved?.values || {}).forEach(([name, value]) => {
        if (settingsForm.elements[name]) settingsForm.elements[name].value = value;
      });
    });
    settingsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(settingsForm));
      await databaseRequest("settings", "readwrite", (store) => store.put({ key: "site", values }));
      showToast("網站設定已儲存於此瀏覽器。 ");
    });
  }

  const rowsBody = document.querySelector("[data-content-rows]");
  if (!rowsBody) return;

  const editor = document.querySelector("[data-editor-dialog]");
  const preview = document.querySelector("[data-preview-dialog]");
  const form = document.querySelector("[data-editor-form]");
  const search = document.querySelector("[data-search]");
  const statusFilter = document.querySelector("[data-status-filter]");
  const empty = document.querySelector("[data-empty]");
  const count = document.querySelector("[data-count]");
  let editingRow = null;
  let editingId = null;
  const thumbnailPreview = document.querySelector("[data-thumbnail-preview]");
  const thumbnailImage = document.querySelector("[data-thumbnail-image]");
  const thumbnailPlaceholder = document.querySelector("[data-thumbnail-placeholder]");
  const thumbnailStatus = document.querySelector("[data-thumbnail-status]");
  let thumbnailObjectUrl = null;
  let activeThumbnailSource = "";

  function youtubeVideoId(value) {
    if (!value?.trim()) return "";
    try {
      const url = new URL(value.trim());
      const hostname = url.hostname.toLowerCase().replace(/^(www\.|m\.|music\.)/, "");
      let id = "";
      if (hostname === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
      if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
        if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
        else id = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1] || "";
      }
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
    } catch {
      return "";
    }
  }

  function youtubeThumbnailUrl(value) {
    const id = youtubeVideoId(value);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  }

  function setThumbnailPreview(source, mode, message) {
    if (!thumbnailPreview) return;
    if (thumbnailObjectUrl && thumbnailObjectUrl !== source) URL.revokeObjectURL(thumbnailObjectUrl);
    thumbnailObjectUrl = mode === "custom" ? source : null;
    activeThumbnailSource = source;
    thumbnailPreview.classList.toggle("is-custom", mode === "custom");
    thumbnailPreview.classList.toggle("is-youtube", mode === "youtube");
    thumbnailImage.hidden = !source;
    thumbnailPlaceholder.hidden = Boolean(source);
    thumbnailImage.removeAttribute("src");
    if (source) thumbnailImage.src = source;
    thumbnailStatus.textContent = message;
  }

  function updateThumbnailPreview(record = null) {
    if (!thumbnailPreview) return;
    const coverField = form.elements.cover;
    const selectedFile = coverField?.files?.[0];
    const savedFile = record?.files?.find((file) => file.field === "cover")?.blob;
    const customFile = selectedFile || savedFile;
    const generatedUrl = youtubeThumbnailUrl(form.elements.media_url?.value);
    if (form.elements.thumbnail_url) form.elements.thumbnail_url.value = generatedUrl;

    if (customFile) {
      setThumbnailPreview(URL.createObjectURL(customFile), "custom", `使用自訂縮圖：${customFile.name || "已儲存圖片"}（優先）`);
      return;
    }
    if (generatedUrl) {
      setThumbnailPreview(generatedUrl, "youtube", "已自動取得 YouTube 縮圖；需要時可用自訂縮圖覆蓋。");
      return;
    }
    const mediaHostname = (() => {
      try { return new URL(form.elements.media_url?.value || "").hostname; } catch { return ""; }
    })();
    const isFacebook = /(^|\.)facebook\.com$/i.test(mediaHostname) || /^fb\.watch$/i.test(mediaHostname);
    setThumbnailPreview("", "", isFacebook ? "Facebook 影片無法自動擷取，請選擇下方的自訂縮圖。" : "貼上 YouTube 網址後會自動顯示縮圖。");
  }

  function rowData(row) {
    const cells = row.cells;
    return {
      id: row.dataset.id,
      module: path,
      title: cells[0].textContent.trim(),
      category: cells[1].textContent.trim(),
      date: cells[2].textContent.trim(),
      status: row.dataset.status,
      updated: cells[4].textContent.trim(),
      fields: {
        title: cells[0].textContent.trim(),
        category: cells[1].textContent.trim(),
        date: cells[2].textContent.trim(),
        status: row.dataset.status
      },
      files: []
    };
  }

  function makeCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
  }

  function buildRow(record) {
    const row = document.createElement("tr");
    row.dataset.row = "";
    row.dataset.id = record.id;
    row.dataset.status = record.status;
    const titleCell = document.createElement("td");
    const title = document.createElement("b");
    title.textContent = record.title;
    titleCell.append(title);
    row.append(titleCell, makeCell(record.category || "未分類"), makeCell(record.date || "尚未設定"));
    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `status-badge status-${record.status}`;
    badge.dataset.statusLabel = "";
    badge.textContent = statusLabels[record.status] || record.status;
    statusCell.append(badge);
    row.append(statusCell, makeCell(record.updated || "剛剛"));
    const actionCell = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "table-action";
    button.dataset.edit = "";
    button.textContent = "編輯";
    actionCell.append(button);
    row.append(actionCell);
    return row;
  }

  function replaceOrPrependRow(record) {
    const existing = [...rowsBody.querySelectorAll("[data-row]")].find((row) => row.dataset.id === record.id);
    const replacement = buildRow(record);
    if (existing) existing.replaceWith(replacement);
    else rowsBody.prepend(replacement);
    return replacement;
  }

  function applyFilters() {
    const term = search.value.trim().toLocaleLowerCase("zh-Hant");
    const selectedStatus = statusFilter.value;
    let visible = 0;
    rowsBody.querySelectorAll("[data-row]").forEach((row) => {
      const matchesTerm = !term || row.textContent.toLocaleLowerCase("zh-Hant").includes(term);
      const matchesStatus = !selectedStatus || row.dataset.status === selectedStatus;
      row.hidden = !(matchesTerm && matchesStatus);
      if (!row.hidden) visible += 1;
    });
    empty.hidden = visible !== 0;
    count.textContent = `${visible} 筆內容`;
  }

  getModuleDrafts(path).then((records) => {
    records.forEach(replaceOrPrependRow);
    applyFilters();
  }).catch(() => showToast("無法讀取瀏覽器草稿。 "));
  search.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  applyFilters();

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function setValue(name, value) {
    const field = form.elements[name];
    if (field && field.type !== "file") field.value = value || "";
  }

  function createId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function openEditor(row) {
    form.reset();
    editingRow = row || null;
    editingId = row?.dataset.id || createId();
    document.querySelector("[data-editor-heading]").textContent = row ? "編輯內容" : "新增內容";
    const record = row ? (await getDraft(editingId)) || rowData(row) : null;
    Object.entries(record?.fields || {}).forEach(([name, value]) => setValue(name, value));
    updateThumbnailPreview(record);
    openDialog(editor);
  }

  document.querySelector("[data-new]")?.addEventListener("click", () => openEditor(null));
  rowsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit]");
    if (button) openEditor(button.closest("[data-row]"));
  });
  document.querySelector("[data-close-editor]")?.addEventListener("click", () => closeDialog(editor));
  document.querySelector("[data-close-preview]")?.addEventListener("click", () => closeDialog(preview));
  form.elements.media_url?.addEventListener("input", () => updateThumbnailPreview());
  form.elements.cover?.addEventListener("change", () => updateThumbnailPreview());

  function collectForm(status) {
    const formData = new FormData(form);
    const fields = {};
    const files = [];
    for (const [name, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size) files.push({ field: name, name: value.name, type: value.type, blob: value });
      } else fields[name] = value;
    }
    fields.status = status || fields.status || "draft";
    return { fields, files };
  }

  function validate(fields) {
    if (!fields.title?.trim()) {
      form.elements.title?.focus();
      showToast("請先填寫標題。 ");
      return false;
    }
    if (path === "admin/downloads" && !fields.document_url?.trim()) {
      form.elements.document_url?.focus();
      showToast("請先填寫文件連結。 ");
      return false;
    }
    const urlField = fields.media_url ? "media_url" : fields.document_url ? "document_url" : null;
    if (urlField && !/^https?:\/\//i.test(fields[urlField])) {
      form.elements[urlField]?.focus();
      showToast(`${urlField === "media_url" ? "影音" : "文件"}網址必須以 http:// 或 https:// 開頭。 `);
      return false;
    }
    return true;
  }

  async function saveRecord(status) {
    const { fields, files } = collectForm(status);
    if (!validate(fields)) return null;
    const previous = editingId ? await getDraft(editingId) : null;
    const mergedFiles = new Map((previous?.files || []).map((file) => [file.field, file]));
    files.forEach((file) => mergedFiles.set(file.field, file));
    const record = {
      id: editingId || createId(),
      module: path,
      title: fields.title.trim(),
      category: fields.category || "未分類",
      date: fields.date || "尚未設定",
      status: fields.status,
      updated: new Date().toLocaleString("zh-TW", { hour12: false }),
      fields,
      files: [...mergedFiles.values()]
    };
    await putDraft(record);
    editingId = record.id;
    editingRow = replaceOrPrependRow(record);
    applyFilters();
    return record;
  }

  document.querySelector("[data-save-draft]")?.addEventListener("click", async () => {
    const record = await saveRecord("draft");
    if (!record) return;
    closeDialog(editor);
    showToast("草稿已儲存於此瀏覽器 IndexedDB。 ");
  });

  document.querySelector("[data-submit-review]")?.addEventListener("click", async () => {
    const record = await saveRecord("review");
    if (!record) return;
    closeDialog(editor);
    showToast("內容已標記為待審核。 ");
  });

  document.querySelector("[data-preview]")?.addEventListener("click", () => {
    const { fields } = collectForm();
    const previewThumbnail = document.querySelector("[data-preview-thumbnail]");
    document.querySelector("[data-preview-category]").textContent = fields.category || "未分類";
    document.querySelector("[data-preview-heading]").textContent = fields.title || "尚未輸入標題";
    document.querySelector("[data-preview-title]").textContent = fields.title || "內容預覽";
    document.querySelector("[data-preview-summary]").textContent = fields.summary || "尚未填寫摘要。";
    document.querySelector("[data-preview-body]").textContent = fields.body || fields.venue || fields.media_url || fields.document_url || "完整內容會依正式頁面版型顯示於此。";
    previewThumbnail.hidden = path !== "admin/media" || !activeThumbnailSource;
    previewThumbnail.removeAttribute("src");
    if (!previewThumbnail.hidden) previewThumbnail.src = activeThumbnailSource;
    openDialog(preview);
  });

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      table[index] = value >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let value = 0xffffffff;
    for (const byte of bytes) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
    return (value ^ 0xffffffff) >>> 0;
  }

  function concatBytes(parts) {
    const length = parts.reduce((total, part) => total + part.length, 0);
    const output = new Uint8Array(length);
    let offset = 0;
    parts.forEach((part) => {
      output.set(part, offset);
      offset += part.length;
    });
    return output;
  }

  function dosDateTime(date = new Date()) {
    const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const year = Math.max(1980, date.getFullYear());
    return { time, day: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate() };
  }

  async function createZip(entries) {
    const localParts = [];
    const centralParts = [];
    let localOffset = 0;
    const { time, day } = dosDateTime();
    for (const entry of entries) {
      const name = textEncoder.encode(entry.name.replaceAll("\\", "/"));
      const data = typeof entry.data === "string" ? textEncoder.encode(entry.data) : new Uint8Array(await entry.data.arrayBuffer());
      const checksum = crc32(data);
      const localHeader = new Uint8Array(30);
      const localView = new DataView(localHeader.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(10, time, true);
      localView.setUint16(12, day, true);
      localView.setUint32(14, checksum, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, name.length, true);
      localParts.push(localHeader, name, data);
      const centralHeader = new Uint8Array(46);
      const centralView = new DataView(centralHeader.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(12, time, true);
      centralView.setUint16(14, day, true);
      centralView.setUint32(16, checksum, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, name.length, true);
      centralView.setUint32(42, localOffset, true);
      centralParts.push(centralHeader, name);
      localOffset += localHeader.length + name.length + data.length;
    }
    const central = concatBytes(centralParts);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, central.length, true);
    endView.setUint32(16, localOffset, true);
    return new Blob([concatBytes([...localParts, central, end])], { type: "application/zip" });
  }

  function safeFileName(value) {
    return value.normalize("NFKC").replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "content";
  }

  async function exportPackage(record) {
    const packageId = `CTDF-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;
    const files = record.files.map((file, index) => ({ field: file.field, name: file.name, type: file.type, path: `uploads/${index + 1}-${safeFileName(file.name)}` }));
    const manifest = {
      schema_version: 1,
      package_id: packageId,
      module: record.module,
      action: record.id.startsWith("seed-") ? "update" : "create",
      title: record.title,
      status: "approved",
      requested_by: "秘書長",
      approved_by: "秘書長",
      exported_at: new Date().toISOString(),
      files
    };
    const content = { ...record, files };
    const entries = [
      { name: "manifest.json", data: JSON.stringify(manifest, null, 2) },
      { name: `content/${record.module.replace("admin/", "")}/${record.id}.json`, data: JSON.stringify(content, null, 2) },
      { name: "README.txt", data: `CTDF 靜態內容上架包\n上架編號：${packageId}\n內容：${record.title}\n\n請由技術人員檢查後，以 Git 分支及 Pull Request 提交。\n` }
    ];
    record.files.forEach((file, index) => entries.push({ name: files[index].path, data: file.blob }));
    const zip = await createZip(entries);
    const url = URL.createObjectURL(zip);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${packageId}-${safeFileName(record.title)}.zip`;
    document.body.append(link);
    link.click();
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 60000);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const record = await saveRecord("approved");
    if (!record) return;
    await exportPackage(record);
    closeDialog(editor);
    showToast("內容已核准並匯出 ZIP 上架包。 ");
  });

  function parseZip(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const entries = new Map();
    let offset = 0;
    while (offset + 4 <= bytes.length && view.getUint32(offset, true) === 0x04034b50) {
      const flags = view.getUint16(offset + 6, true);
      const method = view.getUint16(offset + 8, true);
      const compressedSize = view.getUint32(offset + 18, true);
      const fileNameLength = view.getUint16(offset + 26, true);
      const extraLength = view.getUint16(offset + 28, true);
      if (flags & 0x0008) throw new Error("不支援使用 data descriptor 的 ZIP。");
      if (method !== 0) throw new Error("此 Demo 只能匯入由本後台產生的 ZIP 上架包。");
      const nameStart = offset + 30;
      const dataStart = nameStart + fileNameLength + extraLength;
      const name = textDecoder.decode(bytes.slice(nameStart, nameStart + fileNameLength));
      entries.set(name, bytes.slice(dataStart, dataStart + compressedSize));
      offset = dataStart + compressedSize;
    }
    return entries;
  }

  window.CTDFAdminPackageTools = Object.freeze({ createZip, parseZip });

  document.querySelector("[data-import-package]")?.addEventListener("change", async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const entries = parseZip(new Uint8Array(await file.arrayBuffer()));
      const manifestBytes = entries.get("manifest.json");
      if (!manifestBytes) throw new Error("上架包缺少 manifest.json。");
      const manifest = JSON.parse(textDecoder.decode(manifestBytes));
      if (manifest.schema_version !== 1 || !manifest.module?.startsWith("admin/")) throw new Error("上架包格式不正確。");
      const contentEntry = [...entries.entries()].find(([name]) => name.startsWith("content/") && name.endsWith(".json"));
      if (!contentEntry) throw new Error("上架包缺少內容 JSON。");
      const content = JSON.parse(textDecoder.decode(contentEntry[1]));
      content.files = (manifest.files || []).map((metadata) => {
        const fileBytes = entries.get(metadata.path);
        if (!fileBytes) throw new Error(`上架包缺少附件：${metadata.name}`);
        return { ...metadata, blob: new Blob([fileBytes], { type: metadata.type || "application/octet-stream" }) };
      });
      content.module = manifest.module;
      content.status = "draft";
      content.fields = { ...(content.fields || {}), status: "draft" };
      content.updated = new Date().toLocaleString("zh-TW", { hour12: false });
      await putDraft(content);
      if (content.module !== path) {
        window.location.assign(`/${content.module}/`);
        return;
      }
      const row = replaceOrPrependRow(content);
      applyFilters();
      await openEditor(row);
      showToast("ZIP 上架包已匯入為草稿。 ");
    } catch (error) {
      showToast(error.message || "無法匯入此 ZIP 上架包。 ");
    } finally {
      input.value = "";
    }
  });
})();
