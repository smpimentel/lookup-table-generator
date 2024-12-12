// Utility Functions
function generateCombinations(arrays) {
    if (!arrays || arrays.length === 0) return [[]];
    if (arrays.some(arr => !Array.isArray(arr) || arr.length === 0)) return [];
    
    const [first, ...rest] = arrays;
    const combinations = generateCombinations(rest);
    return first.reduce((acc, x) => [...acc, ...combinations.map(c => [x, ...c])], []);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    notification.className = `fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
        type === 'success' ? 'bg-gray-800 text-white' : 'bg-red-600 text-white'
    }`;
    
    notificationText.textContent = message;
    notification.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        notification.style.transform = 'translateY(-150%)';
    }, 3000);
}

function promptForFilename(defaultName, onSave) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    
    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-lg p-6 max-w-md w-full mx-4';
    dialog.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">Save Configuration</h3>
        <input type="text" 
               value="${defaultName}" 
               class="w-full px-3 py-2 border rounded-lg mb-4"
               id="filenameInput">
        <div class="flex justify-end gap-2">
            <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" id="cancelBtn">
                Cancel
            </button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" id="saveBtn">
                Save
            </button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const input = dialog.querySelector('#filenameInput');
    input.select();
    
    function cleanup() {
        document.body.removeChild(overlay);
    }
    
    dialog.querySelector('#cancelBtn').addEventListener('click', cleanup);
    
    dialog.querySelector('#saveBtn').addEventListener('click', () => {
        const filename = input.value.trim();
        if (filename) {
            onSave(filename);
            cleanup();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const filename = input.value.trim();
            if (filename) {
                onSave(filename);
                cleanup();
            }
        } else if (e.key === 'Escape') {
            cleanup();
        }
    });
}