const issuesList  = document.getElementById('issuesList');
const issueCount  = document.getElementById('issueCount');
const searchInput = document.getElementById('searchInput');
const tabAll      = document.getElementById('tab-all');
const tabOpen     = document.getElementById('tab-open');
const tabClosed   = document.getElementById('tab-closed');

let allIssues     = [];
let currentFilter = 'all';


function priorityBadge(p) {
    return `<span class="priority-badge ${p}">${p.toUpperCase()}</span>`;
}

function labelBadge(label) {
    const l = label.toLowerCase();
    let cls = 'label-default';
    let icon = '🔵';
    if (l === 'bug')                   { cls = 'label-bug';         icon = '🔴'; }
    else if (l === 'enhancement')      { cls = 'label-enhancement'; icon = '🟢'; }
    else if (l.includes('help'))       { cls = 'label-help-wanted'; icon = '🟡'; }
    else if (l.includes('good first')) { cls = 'label-good-first';  icon = '🟢'; }
    else if (l === 'documentation')    { cls = 'label-documentation'; icon = '🔵'; }
    return `<span class="issue-label ${cls}">${icon} ${label.toUpperCase()}</span>`;
}

function statusIcon(s) {
    return s === 'open'
        ? `<span class="status-icon open"><i class="fa-solid fa-circle-dot"></i></span>`
        : `<span class="status-icon closed"><i class="fa-solid fa-circle-check"></i></span>`;
}

function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderCards(issues) {
    if (issueCount) issueCount.textContent = `${issues.length} Issues`;

    if (!issues.length) {
        issuesList.innerHTML = `<p style="color:#9ca3af;font-size:14px">No issues found.</p>`;
        return;
    }

    issuesList.innerHTML =
        `<div class="issues-grid">` +
        issues.map(issue => `
            <div class="issue-card ${issue.priority}">

                <div class="issue-card-header">
                    ${statusIcon(issue.status)}
                    ${priorityBadge(issue.priority)}
                </div>

                <h3 class="issue-title">${issue.title}</h3>

                <p class="issue-description">${issue.description}</p>

                <div class="issue-labels">
                    ${issue.labels.map(l => labelBadge(l)).join('')}
                </div>

                <div class="issue-footer">
                    <span>#${issue.id} by <span class="author">${issue.author}</span></span>
                    <span>${formatDate(issue.createdAt)}</span>
                </div>
            </div>
        `).join('') +
        `</div>`;
}

// ── Filter & Search ────────────────────────────────────────────────────────

function applyFilter(filter) {
    currentFilter = filter;

    [tabAll, tabOpen, tabClosed].forEach(btn => {
        if (!btn) return;
        btn.style.background = '';
        btn.style.color = '#4b5563';
    });
    const activeTab = { all: tabAll, open: tabOpen, closed: tabClosed }[filter];
    if (activeTab) {
        activeTab.style.background = '#4f46e5';
        activeTab.style.color = '#fff';
    }

    const query = searchInput ? searchInput.value.toLowerCase() : '';
    let filtered = allIssues;
    if (filter !== 'all') filtered = filtered.filter(i => i.status === filter);
    if (query) filtered = filtered.filter(i => i.title.toLowerCase().includes(query));
    renderCards(filtered);
}

if (tabAll)    tabAll.addEventListener('click',    () => applyFilter('all'));
if (tabOpen)   tabOpen.addEventListener('click',   () => applyFilter('open'));
if (tabClosed) tabClosed.addEventListener('click', () => applyFilter('closed'));
if (searchInput) searchInput.addEventListener('input', () => applyFilter(currentFilter));

// ── Fetch ──────────────────────────────────────────────────────────────────

fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res => res.json())
    .then(json => {
        allIssues = json.data || json;
        renderCards(allIssues);
    })
    .catch(err => {
        issuesList.innerHTML = '<p style="color:#ef4444">Failed to load issues.</p>';
        console.error(err);
    });