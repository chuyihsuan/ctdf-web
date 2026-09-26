(() => {
  const page = document.body;
  const path = page.dataset.adminPath;
  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  const settingsForm = document.querySelector("[data-settings-form]");
  if (settingsForm) {
    const saved = JSON.parse(localStorage.getItem("ctdf-admin-settings") || "null");
    if (saved) {
      Object.entries(saved).forEach(([name, value]) => {
        if (settingsForm.elements[name]) settingsForm.elements[name].value = value;
      });
    }
    settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(settingsForm));
      localStorage.setItem("ctdf-admin-settings", JSON.stringify(values));
      showToast("網站設定已儲存於此瀏覽器 Demo。 ");
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
  const storageKey = `ctdf-admin-demo:v2:${path}`;
  let editingRow = null;

  const statusLabels = {
    draft: "草稿",
    review: "待審核",
    scheduled: "已排程",
    published: "已發布",
    archived: "已封存"
  };

  function rowData(row) {
    const cells = row.cells;
    return {
      title: cells[0].textContent.trim(),
      category: cells[1].textContent.trim(),
      date: cells[2].textContent.trim(),
      status: row.dataset.status,
      updated: cells[4].textContent.trim()
    };
  }

  function persistRows() {
    const records = [...rowsBody.querySelectorAll("[data-row]")].map(rowData);
    localStorage.setItem(storageKey, JSON.stringify(records));
  }

  function makeCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
  }

  function buildRow(record) {
    const row = document.createElement("tr");
    row.dataset.row = "";
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

  const storedRows = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (Array.isArray(storedRows) && storedRows.length) {
    rowsBody.replaceChildren(...storedRows.map(buildRow));
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
    if (form.elements[name]) form.elements[name].value = value || "";
  }

  function openEditor(row) {
    form.reset();
    editingRow = row || null;
    document.querySelector("[data-editor-heading]").textContent = row ? "編輯內容" : "新增內容";
    if (row) {
      const record = rowData(row);
      Object.entries(record).forEach(([name, value]) => setValue(name, value));
    }
    openDialog(editor);
  }

  document.querySelector("[data-new]")?.addEventListener("click", () => openEditor(null));
  rowsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit]");
    if (button) openEditor(button.closest("[data-row]"));
  });
  document.querySelector("[data-close-editor]")?.addEventListener("click", () => closeDialog(editor));
  document.querySelector("[data-close-preview]")?.addEventListener("click", () => closeDialog(preview));

  function formValues(status) {
    const values = Object.fromEntries(new FormData(form));
    values.status = status || values.status || "draft";
    values.updated = "剛剛";
    return values;
  }

  function validate(values) {
    if (!values.title?.trim()) {
      form.elements.title?.focus();
      showToast("請先填寫標題。 ");
      return false;
    }
    return true;
  }

  function save(status, message) {
    const values = formValues(status);
    if (!validate(values)) return;
    const replacement = buildRow(values);
    if (editingRow) editingRow.replaceWith(replacement);
    else rowsBody.prepend(replacement);
    editingRow = replacement;
    persistRows();
    applyFilters();
    closeDialog(editor);
    showToast(message);
  }

  document.querySelector("[data-save-draft]")?.addEventListener("click", () => save("draft", "草稿已儲存於此瀏覽器 Demo。 "));
  document.querySelector("[data-submit-review]")?.addEventListener("click", () => save("review", "內容已送交審核。 "));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    save("published", "內容已模擬發布。 ");
  });

  document.querySelector("[data-preview]")?.addEventListener("click", () => {
    const values = formValues();
    document.querySelector("[data-preview-category]").textContent = values.category || "未分類";
    document.querySelector("[data-preview-heading]").textContent = values.title || "尚未輸入標題";
    document.querySelector("[data-preview-title]").textContent = values.title || "內容預覽";
    document.querySelector("[data-preview-summary]").textContent = values.summary || "尚未填寫摘要。";
    document.querySelector("[data-preview-body]").textContent = values.body || values.venue || values.media_url || "完整內容會依正式頁面版型顯示於此。";
    openDialog(preview);
  });
})();
