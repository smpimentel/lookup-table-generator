// Parameter Manager Class
class ParameterManager {
    constructor() {
        this.parameters = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('parameterForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addParameter();
        });

        document.getElementById('paramType')?.addEventListener('change', (e) => {
            this.updateUnitOptions(e.target.value);
        });

        // Initialize unit options
        this.updateUnitOptions('NUMBER');
    }

    getParameters() {
        return this.parameters;
    }

    addParameter() {
        const name = document.getElementById('paramName')?.value.trim();
        const type = document.getElementById('paramType')?.value;
        const unit = document.getElementById('paramUnit')?.value;

        if (!name) return;

        const parameter = {
            id: crypto.randomUUID(),
            name,
            type,
            unit,
            values: []
        };

        this.parameters.push(parameter);
        this.updateParameterList();
        
        // Reset form
        const form = document.getElementById('parameterForm');
        form?.reset();
        this.updateUnitOptions('NUMBER');
    }

    updateUnitOptions(type) {
        const unitSelect = document.getElementById('paramUnit');
        if (!unitSelect) return;

        const units = PARAMETER_TYPES[type]?.units || [];
        unitSelect.innerHTML = units.map(unit => 
            `<option value="${unit.value}">${unit.label}</option>`
        ).join('');
    }

    addValue(parameterId, value) {
        const parameter = this.parameters.find(p => p.id === parameterId);
        if (parameter && value.trim()) {
            parameter.values.push(value.trim());
            this.updateParameterList();
        }
    }

    removeValue(parameterId, valueIndex) {
        const parameter = this.parameters.find(p => p.id === parameterId);
        if (parameter) {
            parameter.values.splice(valueIndex, 1);
            this.updateParameterList();
        }
    }

    removeParameter(parameterId) {
        this.parameters = this.parameters.filter(p => p.id !== parameterId);
        this.updateParameterList();
    }

    loadParameters(parameters) {
        this.parameters = parameters;
        this.updateParameterList();
    }

    updateParameterList() {
        const container = document.getElementById('parameterList');
        if (!container) return;

        container.innerHTML = this.parameters.map(param => `
            <div class="parameter-item mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <h3 class="text-lg font-semibold">${param.name}##${param.type}##${param.unit}</h3>
                    </div>
                    <button onclick="parameterManager.removeParameter('${param.id}')" 
                            class="text-red-600 hover:bg-red-100 p-1 rounded">
                        Delete
                    </button>
                </div>
                <div class="flex gap-2 mb-2">
                    <input type="text" 
                           placeholder="Add value" 
                           class="flex-1 px-3 py-1 border rounded value-input"
                           data-param-id="${param.id}"
                           onkeydown="if(event.key === 'Enter') {
                               event.preventDefault();
                               const value = this.value.trim();
                               if (value) {
                                   parameterManager.addValue('${param.id}', value);
                                   this.value = '';
                                   this.focus();
                               }
                           }">
                    <button onclick="const input = this.previousElementSibling;
                                   const value = input.value.trim();
                                   if (value) {
                                       parameterManager.addValue('${param.id}', value);
                                       input.value = '';
                                       input.focus();
                                   }"
                            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${param.values.map((value, index) => `
                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                            ${value}
                            <button onclick="parameterManager.removeValue('${param.id}', ${index})"
                                    class="text-gray-500 hover:text-red-600">
                                ×
                            </button>
                        </span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // After updating the list, restore focus to the last active input if any
        const lastFocusedInput = document.activeElement;
        if (lastFocusedInput?.classList.contains('value-input')) {
            const paramId = lastFocusedInput.dataset.paramId;
            const newInput = container.querySelector(`input[data-param-id="${paramId}"]`);
            newInput?.focus();
        }

        this.updatePreview();
    }

    updatePreview() {
        const previewSection = document.getElementById('previewSection');
        const previewTable = document.getElementById('previewTable');
        
        if (!previewSection || !previewTable || this.parameters.length === 0) {
            previewSection?.classList.add('hidden');
            return;
        }

        previewSection.classList.remove('hidden');
        const parameterValues = this.parameters.map(p => p.values);
        const combinations = generateCombinations(parameterValues);

        // Create parameter index mapping for validation
        const parameterIndexes = {};
        this.parameters.forEach((param, index) => {
            parameterIndexes[param.id] = index;
        });

        // Filter combinations based on mapping rules
        const validCombinations = window.mappingManager 
            ? combinations.filter(combination => 
                window.mappingManager.validateCombination(combination, parameterIndexes))
            : combinations;

        previewTable.innerHTML = this.generateTableHTML(validCombinations);
    }

    generateTableHTML(combinations) {
        return `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                        ${this.parameters.map(param => `
                            <th class="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                                ${param.name}##${param.type}##${param.unit}
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${combinations.map((combination, index) => `
                        <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                            <td class="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">Row_${index + 1}</td>
                            ${combination.map(value => `
                                <td class="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">${value}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}