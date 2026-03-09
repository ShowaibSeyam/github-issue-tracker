const issuesList = document.getElementById('issuesList');


// "data": [
// {
// "id": 1,
// "title": "Fix navigation menu on mobile devices",
// "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
// "status": "open",
// "labels": [
// "bug",
// "help wanted"
// ],
// "priority": "high",
// "author": "john_doe",
// "assignee": "jane_smith",
// "createdAt": "2024-01-15T10:30:00Z",
// "updatedAt": "2024-01-15T10:30:00Z"
// },

if (issuesList) {
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

    fetch(url)
        .then(res => res.json())
        .then(json => {
            const issues = json.data || json;

            issuesList.innerHTML = issues.map(issue => `
                <div class="issue-card">
                    <div class="issue-card-header">
                        <span class="issue-status">${issue.status}</span>
                        <span class="issue-priority">${issue.priority}</span>
                    </div>
                    <h3 class="issue-title">${issue.title}</h3>
                    <p class="issue-description">${issue.description}</p>
                    <div class="issue-labels">
                        ${issue.labels.map(label => `<span class="issue-label">${label}</span>`).join('')}
                    </div>
                    <div class="issue-footer">
                        <span>#${issue.id} by ${issue.author}</span>
                        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => {
            issuesList.innerHTML = '<p>Failed to load issues.</p>';
            console.error(err);
        });
}