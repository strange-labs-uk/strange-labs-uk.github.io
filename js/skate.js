document.addEventListener('DOMContentLoaded', function() {
    initializeChecklistFromConfig();
    document.getElementById('resetProgress').addEventListener('click', resetProgress);
    loadProgress();
    updateProgress();
});

function initializeChecklistFromConfig() {
    document.getElementById('checklistTitle').textContent = checklistConfig.title;
    document.getElementById('checklistDescription').textContent = checklistConfig.description;

    var container = document.getElementById('checklistContainer');

    for (var i = 0; i < checklistConfig.categories.length; i += 2) {
        var row = document.createElement('div');
        row.className = 'row';

        if (i < checklistConfig.categories.length) {
            var col1 = document.createElement('div');
            col1.className = 'col-md-6';
            col1.innerHTML = generateCategoryHTML(checklistConfig.categories[i]);
            row.appendChild(col1);
        }

        if (i + 1 < checklistConfig.categories.length) {
            var col2 = document.createElement('div');
            col2.className = 'col-md-6';
            col2.innerHTML = generateCategoryHTML(checklistConfig.categories[i + 1]);
            row.appendChild(col2);
        }

        container.appendChild(row);
    }

    initializeChecklist();
}

function generateCategoryHTML(category) {
    var html = '<h3>' + category.name + '</h3><div class="trick-category">';
    category.tricks.forEach(function(trick) {
        html += '<label class="trick-item">' +
            '<input type="checkbox" data-trick="' + trick.id + '" class="trick-checkbox">' +
            '<span class="checkmark"></span>' +
            trick.name +
            '</label>';
    });
    html += '</div>';
    return html;
}

function initializeChecklist() {
    var checkboxes = document.querySelectorAll('.trick-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            saveProgress();
            updateProgress();
        });
        checkbox.addEventListener('click', function(event) {
            this._lastClickEvent = event;
        });
    });
}

function updateTrickItemSilently(checkbox) {
    var trickItem = checkbox.closest('.trick-item');
    if (checkbox.checked) {
        trickItem.classList.add('completed');
    } else {
        trickItem.classList.remove('completed');
    }
}

function saveProgress() {
    var checkboxes = document.querySelectorAll('.trick-checkbox');
    var progress = {};
    checkboxes.forEach(function(checkbox) {
        progress[checkbox.dataset.trick] = checkbox.checked;
    });
    localStorage.setItem('skateProgress', JSON.stringify(progress));
}

function loadProgress() {
    var saved = localStorage.getItem('skateProgress');
    if (saved) {
        var progress = JSON.parse(saved);
        var checkboxes = document.querySelectorAll('.trick-checkbox');
        checkboxes.forEach(function(checkbox) {
            var trickId = checkbox.dataset.trick;
            if (progress.hasOwnProperty(trickId)) {
                checkbox.checked = progress[trickId];
                updateTrickItemSilently(checkbox);
            }
        });
    }
}

function updateTrickItem(checkbox, event) {
    var trickItem = checkbox.closest('.trick-item');
    if (checkbox.checked) {
        if (!trickItem.classList.contains('completed')) {
            createExplosion(trickItem, event);
        }
        trickItem.classList.add('completed');
    } else {
        trickItem.classList.remove('completed');
    }
}

function createExplosion(element, event) {
    cleanupExplosions();

    var centerX, centerY;
    if (event && event.clientX !== undefined && event.clientY !== undefined) {
        centerX = event.clientX;
        centerY = event.clientY;
    } else {
        var rect = element.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
    }

    var explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.cssText = 'position:fixed;left:' + centerX + 'px;top:' + centerY + 'px;pointer-events:none;z-index:1000;';

    var particleCount = 15 + Math.floor(Math.random() * 8);
    var colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF8E53', '#A8E6CF'];

    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.className = 'explosion-particle';

        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        var size = 4 + Math.random() * 8;

        particle.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:' + randomColor + ';border-radius:50%;box-shadow:0 0 ' + (size * 2) + 'px ' + randomColor + ';';

        var angle = (i / particleCount) * 2 * Math.PI + (Math.random() * 0.5);
        var speed = 80 + Math.random() * 120;
        var vx = Math.cos(angle) * speed;
        var vy = Math.sin(angle) * speed;
        var rotation = Math.random() * 360;

        particle.animate([
            { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + (vx * 0.3) + 'px, ' + (vy * 0.3) + 'px) scale(1.2) rotate(' + (rotation * 0.3) + 'deg)', opacity: 1 },
            { transform: 'translate(' + vx + 'px, ' + vy + 'px) scale(0) rotate(' + rotation + 'deg)', opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        explosion.appendChild(particle);
    }

    document.body.appendChild(explosion);

    setTimeout(function() {
        if (explosion && explosion.parentNode) {
            explosion.parentNode.removeChild(explosion);
        }
    }, 1500);
}

function cleanupExplosions() {
    var existing = document.querySelectorAll('.explosion');
    existing.forEach(function(el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
}

function updateProgress() {
    var checkboxes = document.querySelectorAll('.trick-checkbox');
    var completed = Array.from(checkboxes).filter(function(cb) { return cb.checked; }).length;
    var total = checkboxes.length;
    var percentage = total > 0 ? (completed / total) * 100 : 0;

    document.getElementById('progressCount').textContent = completed;
    var totalCountElement = document.getElementById('totalCount');
    if (totalCountElement) {
        totalCountElement.textContent = total;
    }
    var progressBarElement = document.getElementById('progressBar');
    if (progressBarElement) {
        progressBarElement.style.width = percentage + '%';
    }

    checkboxes.forEach(function(checkbox) {
        updateTrickItem(checkbox, checkbox._lastClickEvent);
    });
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        var checkboxes = document.querySelectorAll('.trick-checkbox');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
        saveProgress();
        updateProgress();
    }
}
