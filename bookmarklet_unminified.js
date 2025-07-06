(function() {
    'use strict';
    
    // Configuration
    const STORAGE_KEY = 'berklee_ensemble_clicker';
    const REFRESH_INTERVAL = 10; // 10ms for fastest navigation
    const NAVIGATION_DELAY = 0; // No delay for fastest navigation
    const SCRIPT_KEY = 'berklee_ensemble_script';
    const UI_INJECTED_KEY = 'berklee_ui_injected';
    
    // Initialize or resume
    let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"active": false, "clickCount": 0, "windowOpened": false, "isNavigating": false}');
    
    // Check if we should auto-start (returning from refresh)
    const shouldAutoStart = localStorage.getItem(SCRIPT_KEY) === 'active';
    
    if (shouldAutoStart && !state.active) {
        console.log("🔄 Auto-resuming bookmarklet after page refresh (clicks: " + state.clickCount + ")");
        state.active = true;
        saveState();
    } else if (state.active) {
        console.log("🔄 Resuming bookmarklet after page refresh (clicks: " + state.clickCount + ")");
    } else {
        console.log("🚀 Starting ensemble bookmarklet");
        state.active = true;
        state.clickCount = 0;
        state.windowOpened = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem(SCRIPT_KEY, 'active');
    }
    
    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // Injects the Berklee App UI into the target window
    function injectUIIntoWindow(targetWindow) {
        console.log("🎨 Attempting to inject UI into window...");
        
        if (!targetWindow || !targetWindow.document) {
            console.log("❌ Target window or document not available for UI injection");
            return;
        }
        
        // Check if UI is already injected
        if (targetWindow.document.getElementById('berklee-app-ui')) {
            console.log("✅ UI already injected");
            return;
        }
        
        // Find the schedule container
        const scheduleContainer = targetWindow.document.getElementById('schedule_container');
        if (!scheduleContainer) {
            console.log("❌ Schedule container not found for UI injection");
            return;
        }
        
        console.log("📦 Injecting UI into schedule container");
        
        // Style the existing schedule container
        scheduleContainer.style.display = 'flex';
        scheduleContainer.style.flexDirection = 'column';
        scheduleContainer.style.gap = '0px';
        scheduleContainer.style.alignItems = 'center';
        scheduleContainer.style.marginBottom = '20px';
        scheduleContainer.style.overflow = 'visible';
        
        // Adjust spacing of next sibling
        const nextSibling = scheduleContainer.nextElementSibling;
        if (nextSibling && nextSibling.tagName.toLowerCase() === 'center') {
            nextSibling.style.marginTop = '20px';
        }
        
        // Create UI container
        const uiContainer = targetWindow.document.createElement('div');
        uiContainer.id = 'berklee-app-ui';
        uiContainer.style.cssText = 'width:662px;max-width:662px;min-width:662px;background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);max-height:80vh;overflow-y:auto;margin-left:auto;margin-right:auto;margin-top:20px;padding-bottom:0px;';
        
        // Add the complete UI HTML from the minified version
        uiContainer.innerHTML = `<style>#berklee-app-ui *{margin:0;padding:0;box-sizing:border-box}#berklee-app-ui .room-selection-wrapper{display:flex;flex-direction:column;padding:20px;gap:20px;background-color:#eeece5;border-radius:8px;width:100%;height:fit-content}#berklee-app-ui .add-time-slot{width:100%;box-shadow:-1px 1px 2px rgba(139,138,133,0.2) inset,1px -1px 2px rgba(139,138,133,0.2) inset,-1px -1px 2px rgba(255,255,255,0.9) inset,1px 1px 3px rgba(139,138,133,0.9) inset;border-radius:2px;background-color:rgba(224,222,215,0.72);height:39px;display:flex;flex-direction:row;align-items:center;justify-content:center;padding:0px 35px;box-sizing:border-box;font-size:10px;color:#3a3a3a;font-family:'Jaldi',sans-serif}#berklee-app-ui .room-details{width:582px;max-width:582px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:10px}#berklee-app-ui .room-number,#berklee-app-ui .time-slot{box-shadow:0px 1px 3px rgba(0,0,0,0.12);border-radius:1px;background-color:#eeece5;height:19px;display:flex;flex-direction:row;align-items:center;justify-content:center;padding:8px 20px;box-sizing:border-box;outline:none;font-size:10px;color:#3a3a3a;font-family:'Jaldi',sans-serif;cursor:text;text-align:center;line-height:1;position:relative;caret-color:transparent!important;-webkit-caret-color:transparent!important;-moz-caret-color:transparent!important;-ms-caret-color:transparent!important;flex:1}#berklee-app-ui .room-number:empty::before,#berklee-app-ui .time-slot:empty::before{content:attr(data-placeholder);color:#8a8a8a;opacity:1;pointer-events:none}#berklee-app-ui .room-number:focus::before,#berklee-app-ui .time-slot:focus::before,#berklee-app-ui .room-number:not(:empty)::before,#berklee-app-ui .time-slot:not(:empty)::before{display:none}#berklee-app-ui .room-number:hover,#berklee-app-ui .time-slot:hover{background-color:#f0f8ff;border:1px solid #87ceeb}#berklee-app-ui .room-number.selection-active,#berklee-app-ui .time-slot.selection-active{background-color:#e3f2fd!important;border:2px solid #2196f3!important;box-shadow:0 0 0 2px rgba(33,150,243,0.2)!important}#berklee-app-ui .room-number.selection-active{background-color:#e3f2fd!important;border:2px solid #2196f3!important;box-shadow:0 0 0 2px rgba(33,150,243,0.2)!important}#berklee-app-ui .time-slot.selection-active{background-color:#fff3e0!important;border:2px solid #ff9800!important;box-shadow:0 0 0 2px rgba(255,152,0,0.2)!important}.time-start-selected{background-color:#ffeb3b!important;border:2px solid #fbc02d!important;box-shadow:0 0 0 2px rgba(251,192,45,0.3)!important}#berklee-app-ui .go-button{width:24px;height:24px;border-radius:50%;cursor:pointer;flex-shrink:0}#berklee-app-ui .go-button:hover{}#berklee-app-ui .room-list{width:100%;box-shadow:-1px 1px 2px rgba(219,218,212,0.2) inset,1px -1px 2px rgba(219,218,212,0.2) inset,-1px -1px 2px rgba(255,255,255,0.9) inset,1px 1px 3px rgba(219,218,212,0.9) inset;border-radius:2px;background-color:#f3f2ec;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:20px 20px;box-sizing:border-box;gap:20px;font-size:10px;color:#3a3a3a;font-family:'Jaldi',sans-serif;min-height:200px}#berklee-app-ui .room-item{width:100%;box-shadow:0px 0px 3.2px rgba(0,0,0,0.17);background-color:#f3f2ec;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;padding:8px 15px;box-sizing:border-box;border-radius:4px;transition:transform 0.2s ease;position:relative}#berklee-app-ui .room-item-content{flex:1;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:10px}#berklee-app-ui .sort-button{width:8.6px;border-radius:2px;height:7.1px;cursor:grab;flex-shrink:0}#berklee-app-ui .sort-button:hover{}#berklee-app-ui .sort-button:active{cursor:grabbing}#berklee-app-ui .room-number-item,#berklee-app-ui .time-slot-item{border-radius:1px;height:19px;display:flex;flex-direction:row;align-items:center;justify-content:center;padding:8px 10px;box-sizing:border-box;font-size:10px;font-family:'Jaldi',sans-serif;color:#3a3a3a;background-color:rgba(255,255,255,0);border-radius:2px;min-width:60px;text-align:center}#berklee-app-ui .remove-button{width:13.5px;height:12.8px;cursor:pointer;flex-shrink:0}#berklee-app-ui .remove-button:hover{}#berklee-app-ui .room-item.dragging{opacity:0.7;z-index:1000;pointer-events:none;transition:none;position:fixed}#berklee-app-ui .room-item.drag-placeholder{opacity:0;background-color:transparent;border:none;height:40px;margin:10px 0}#berklee-app-ui .StartButtonSection{width:100%;position:relative;height:43px;padding:9px 20px;flex-direction:column;justify-content:center;align-items:center;gap:10px;display:flex;box-sizing:border-box;pointer-events:none}#berklee-app-ui .Frame1{padding:6px 9px;justify-content:center;align-items:center;gap:10px;display:inline-flex;pointer-events:auto}#berklee-app-ui .StartButtonFrame{width:25px;height:25px;background:#F5F5F4;box-shadow:-1px 1px 3px rgba(176,176,176,0.90);border-radius:4px;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;flex-shrink:0}</style><div class="room-selection-wrapper"><div class="add-time-slot"><div class="room-details"><div class="room-number" contenteditable="true" data-placeholder="Room"></div><div class="time-slot" contenteditable="true" data-placeholder="Time"></div><div data-svg-wrapper data-layer="Go Button" class="go-button" style="position: relative"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_di_2_26)"><rect x="3" y="0.5" width="18" height="18" rx="7" fill="#EEEEEE"/><path d="M12 5.18L12 13.82M16.32 9.5L7.68 9.5" stroke="#3A3A3A" stroke-width="0.5" stroke-linecap="round"/></g><defs><filter id="filter0_di_2_26" x="0" y="0.5" width="24" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="3"/><feGaussianBlur stdDeviation="1.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_26"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_26" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="0.15"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="shape" result="effect2_innerShadow_2_26"/></filter></defs></svg></div></div></div><div class="room-list"><div class="room-item"><div class="room-item-content"><svg class="sort-button" alt="Sort" width="8.6" height="7.1" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="8.6" height="1.2" fill="#666"/><rect y="3.4" width="8.6" height="1.2" fill="#666"/><rect y="6.8" width="8.6" height="1.2" fill="#666"/></svg><div class="room-number-item">130-A03</div><div class="time-slot-item">6pm - 8pm</div><svg class="remove-button" alt="Remove" width="13.5" height="12.8" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l12 11M13 1L1 12" stroke="#666" stroke-width="2"/></svg></div></div></div><div class="StartButtonSection"><div class="Frame1"><div class="StartButtonFrame"><svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.78344 1.13546L2.66909 1.35778L2.66909 1.35778L2.78344 1.13546ZM9.43232 4.55516L9.54667 4.33284L9.54667 4.33284L9.43232 4.55516ZM9.43232 6.44484L9.54667 6.66716L9.54667 6.66716L9.43232 6.44484ZM2.78344 9.86454L2.66909 9.64222L2.66909 9.64222L2.78344 9.86454ZM2.78344 1.13546L2.66909 1.35778L9.31798 4.77748L9.43232 4.55516L9.54667 4.33284L2.89778 0.913145L2.78344 1.13546ZM9.43232 6.44484L9.31798 6.22252L2.66909 9.64222L2.78344 9.86454L2.89778 10.0869L9.54667 6.66716L9.43232 6.44484ZM1 2.26927H0.75V8.73073H1H1.25V2.26927H1ZM2.78344 9.86454L2.66909 9.64222C2.02651 9.97271 1.25 9.49782 1.25 8.73073H1H0.75C0.75 9.84831 1.90162 10.5992 2.89778 10.0869L2.78344 9.86454ZM9.43232 4.55516L9.31798 4.77748C9.89401 5.07375 9.89401 5.92625 9.31798 6.22252L9.43232 6.44484L9.54667 6.66716C10.4844 6.18483 10.4844 4.81517 9.54667 4.33284L9.43232 4.55516ZM2.78344 1.13546L2.89778 0.913145C1.90161 0.40079 0.75 1.15169 0.75 2.26927H1H1.25C1.25 1.50218 2.02651 1.02729 2.66909 1.35778L2.78344 1.13546Z" fill="#3A3A3A"/></svg></div></div></div></div>`;
        
        scheduleContainer.appendChild(uiContainer);
        
        console.log("✅ UI injected successfully, initializing functionality");
        initUI(targetWindow);
    }

    // Initializes the UI functionality and event handlers
    function initUI(targetWindow) {
        console.log("🎛️ Initializing UI functionality");
        
        const uiContainer = targetWindow.document.getElementById('berklee-app-ui');
        if (!uiContainer) {
            console.log("❌ UI container not found for initialization");
            return;
        }
        
        // Get UI elements
        const goButton = uiContainer.querySelector('.go-button');
        const startButton = uiContainer.querySelector('.StartButtonFrame');
        const roomList = uiContainer.querySelector('.room-list');
        const roomNumberField = uiContainer.querySelector('.room-number');
        const timeSlotField = uiContainer.querySelector('.time-slot');
        
        // UI state variables
        let timeClickHandler = null;
        let roomSelectionHandler = null;
        let isRoomSelectionActive = false;
        let isMultiSelectMode = false;
        let selectedRooms = new Set();
        let isTimeSelectionActive = false;
        let timeSelectionMode = 'start'; // 'start' or 'end'
        let startTime = null;
        
        // Drag and drop state variables
        let dragState = {
            isDragging: false,
            draggedElement: null,
            placeholder: null,
            startY: 0,
            startX: 0,
            originalIndex: 0,
            currentIndex: 0
        };

        // Sets up room selection functionality
        function setupRoomSelection() {
            console.log("🏠 Setting up room selection");
            
            if (roomNumberField) {
                roomNumberField.addEventListener('click', function(event) {
                    if (!isRoomSelectionActive) {
                        console.log("🎯 Room selection mode activated");
                        event.stopPropagation();
                        
                        if (isTimeSelectionActive) exitTimeSelection();
                        
                        isRoomSelectionActive = true;
                        isMultiSelectMode = false;
                        selectedRooms.clear();
                        
                        roomNumberField.classList.add('selection-active');
                        roomNumberField.textContent = 'Click room or Cmd+click for multi-select...';
                        
                        applyRoomSelectableStyles();
                        setupTimeClickDuringRoomSelection();
                        
                        targetWindow.document.addEventListener('click', handleClickOutsideRoomSelection);
                        targetWindow.document.addEventListener('keydown', handleRoomSelectionKeypress);
                    }
                });
            }
            
            // Handle room clicks
            const scheduleWrapper = targetWindow.document.getElementById('tab_wrap');
            if (scheduleWrapper) {
                scheduleWrapper.addEventListener('click', function(event) {
                    const cell = event.target.closest('th, td');
                    if (cell && isRoomSelectionActive) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        
                        const isMultiSelect = event.metaKey || event.ctrlKey;
                        
                        // Extract room text
                        let roomText = '';
                        const textWalker = targetWindow.document.createTreeWalker(
                            cell,
                            NodeFilter.SHOW_TEXT,
                            {
                                acceptNode: function(node) {
                                    const parent = node.parentElement;
                                    if (parent && parent.tagName.toLowerCase() === 'span') {
                                        return NodeFilter.FILTER_REJECT;
                                    }
                                    return NodeFilter.FILTER_ACCEPT;
                                }
                            }
                        );
                        
                        let textNode;
                        while (textNode = textWalker.nextNode()) {
                            roomText += textNode.textContent;
                        }
                        roomText = roomText.trim();
                        
                        if (roomText) {
                            console.log("🏠 Room clicked:", roomText);
                            
                            if (isMultiSelect) {
                                isMultiSelectMode = true;
                                if (selectedRooms.has(roomText)) {
                                    selectedRooms.delete(roomText);
                                    cell.classList.remove('room-selected');
                                    console.log("➖ Room deselected:", roomText);
                                } else {
                                    selectedRooms.add(roomText);
                                    cell.classList.add('room-selected');
                                    console.log("➕ Room selected:", roomText);
                                }
                                updateRoomSelectionDisplay();
                            } else {
                                if (isMultiSelectMode && selectedRooms.size > 0) {
                                    selectedRooms.add(roomText);
                                    cell.classList.add('room-selected');
                                    console.log("➕ Room added to selection:", roomText);
                                    updateRoomSelectionDisplay();
                                } else {
                                    roomNumberField.textContent = roomText;
                                    console.log("✅ Single room selected:", roomText);
                                    exitRoomSelection();
                                }
                            }
                        }
                    }
                }, true);
            }
        }
        
        // Updates room selection display text
        function updateRoomSelectionDisplay() {
            if (selectedRooms.size === 0) {
                roomNumberField.textContent = 'Click room or Cmd+click for multi-select...';
            } else if (selectedRooms.size === 1) {
                roomNumberField.textContent = Array.from(selectedRooms)[0] + ' (Click time or press Enter)';
            } else {
                roomNumberField.textContent = `${selectedRooms.size} rooms selected (Click time or press Enter)`;
            }
        }
        
        // Sets up time clicking during room selection
        function setupTimeClickDuringRoomSelection() {
            console.log("⏰ Setting up time clicking during room selection");
            
            timeClickHandler = function(event) {
                const cell = event.target.closest('td, th');
                if (cell && isRoomSelectionActive) {
                    const timeText = cell.textContent.trim();
                    const timeRegex = /^\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\s*(?:\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?\s*$/;
                    
                    const isValidTime = timeRegex.test(timeText) && 
                                      timeText.length > 1 && 
                                      timeText.length < 20 && 
                                      !timeText.toLowerCase().includes('book') &&
                                      !timeText.toLowerCase().includes('slot') &&
                                      !timeText.toLowerCase().includes('reserve') &&
                                      !timeText.toLowerCase().includes('available') &&
                                      !timeText.toLowerCase().includes('click') &&
                                      !cell.classList.contains('booking') &&
                                      !cell.classList.contains('booked') &&
                                      !cell.querySelector('button, input, a');
                    
                    if (isValidTime && selectedRooms.size > 0) {
                        console.log("⏰ Time selected during room selection:", timeText);
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        
                        // Update room field display
                        if (roomNumberField) {
                            if (selectedRooms.size === 1) {
                                roomNumberField.textContent = Array.from(selectedRooms)[0];
                            } else {
                                roomNumberField.textContent = `${selectedRooms.size} rooms selected`;
                            }
                        }
                        
                        exitRoomSelection();
                        
                        // Start time selection
                        if (timeSlotField) {
                            isTimeSelectionActive = true;
                            timeSelectionMode = 'start';
                            startTime = null;
                            timeSlotField.classList.add('selection-active');
                            timeSlotField.textContent = 'Click start time in schedule...';
                            
                            applyTimeSelectableStyles();
                            targetWindow.document.addEventListener('click', handleClickOutsideTimeSelection);
                            targetWindow.document.addEventListener('keydown', handleTimeSelectionKeypress);
                        }
                    }
                }
            };
            
            // Add listeners to schedule areas
            const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
            if (scheduleFrame) {
                const setupScheduleFrameListener = () => {
                    try {
                        const frameDoc = scheduleFrame.contentDocument || scheduleFrame.contentWindow.document;
                        if (frameDoc) {
                            frameDoc.addEventListener('click', timeClickHandler, true);
                        }
                    } catch (e) {
                        console.log("⚠️ Could not access schedule frame:", e.message);
                    }
                };
                setupScheduleFrameListener();
                scheduleFrame.addEventListener('load', setupScheduleFrameListener);
            }
            
            const scheduleTab = targetWindow.document.getElementById('emsscheduletab');
            if (scheduleTab) {
                scheduleTab.addEventListener('click', timeClickHandler, true);
            }
        }
        
        // Handles Enter key press during room selection
        function handleRoomSelectionKeypress(event) {
            if (event.key === 'Enter' && isRoomSelectionActive && selectedRooms.size > 0) {
                console.log("⌨️ Enter pressed - proceeding to time selection");
                event.preventDefault();
                event.stopPropagation();
                
                if (roomNumberField) {
                    if (selectedRooms.size === 1) {
                        roomNumberField.textContent = Array.from(selectedRooms)[0];
                    } else {
                        roomNumberField.textContent = `${selectedRooms.size} rooms selected`;
                    }
                }
                
                exitRoomSelection();
                
                if (timeSlotField) {
                    isTimeSelectionActive = true;
                    timeSelectionMode = 'start';
                    startTime = null;
                    timeSlotField.classList.add('selection-active');
                    timeSlotField.textContent = 'Click start time in schedule...';
                    
                    applyTimeSelectableStyles();
                    targetWindow.document.addEventListener('click', handleClickOutsideTimeSelection);
                    targetWindow.document.addEventListener('keydown', handleTimeSelectionKeypress);
                }
            }
        }
        
        // Handles Enter key press during time selection
        function handleTimeSelectionKeypress(event) {
            if (event.key === 'Enter' && isTimeSelectionActive && startTime) {
                console.log("⌨️ Enter pressed - confirming time selection");
                event.preventDefault();
                event.stopPropagation();
                
                if (selectedRooms.size > 0) {
                    createRoomItems();
                }
                
                exitTimeSelection();
            }
        }
        
        // Applies selectable styles to room cells
        function applyRoomSelectableStyles() {
            console.log("🎨 Applying room selectable styles");
            
            const scheduleWrapper = targetWindow.document.getElementById('tab_wrap');
            if (scheduleWrapper) {
                const cells = scheduleWrapper.querySelectorAll('th, td');
                cells.forEach(cell => {
                    cell.style.cursor = 'pointer';
                    cell.style.backgroundColor = '#f0f8ff';
                    cell.style.border = '1px solid #87ceeb';
                    cell.classList.add('room-selectable');
                });
            }
            
            targetWindow.document.body.classList.add('room-selection-active');
            
            const styles = targetWindow.document.createElement('style');
            styles.textContent = `
                .room-selected { background-color: #4CAF50 !important; color: white !important; border: 2px solid #45a049 !important; }
                .room-selectable:hover { background-color: #e6f3ff !important; }
                .room-selected:hover { background-color: #45a049 !important; }
                .room-selection-active .room-selectable:hover { background-color: #f0f8ff !important; }
            `;
            styles.id = 'room-selection-styles';
            targetWindow.document.head.appendChild(styles);
        }
        
        // Removes selectable styles from room cells
        function removeRoomSelectableStyles() {
            console.log("🧹 Removing room selectable styles");
            
            const scheduleWrapper = targetWindow.document.getElementById('tab_wrap');
            if (scheduleWrapper) {
                const cells = scheduleWrapper.querySelectorAll('th.room-selectable, td.room-selectable');
                cells.forEach(cell => {
                    cell.style.cursor = '';
                    cell.style.backgroundColor = '';
                    cell.style.border = '';
                    cell.classList.remove('room-selectable');
                    cell.classList.remove('room-selected');
                });
            }
            
            targetWindow.document.body.classList.remove('room-selection-active');
            
            const styles = targetWindow.document.getElementById('room-selection-styles');
            if (styles) styles.remove();
        }
        
        // Exits room selection mode
        function exitRoomSelection() {
            console.log("🚪 Exiting room selection mode");
            
            isRoomSelectionActive = false;
            isMultiSelectMode = false;
            
            if (roomNumberField) {
                roomNumberField.classList.remove('selection-active');
            }
            
            removeRoomSelectableStyles();
            cleanupTimeClickHandlers();
            
            targetWindow.document.removeEventListener('click', handleClickOutsideRoomSelection);
            targetWindow.document.removeEventListener('keydown', handleRoomSelectionKeypress);
        }
        
        // Cleans up time click handlers during room selection
        function cleanupTimeClickHandlers() {
            if (timeClickHandler) {
                const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
                if (scheduleFrame) {
                    try {
                        const frameDoc = scheduleFrame.contentDocument || scheduleFrame.contentWindow.document;
                        if (frameDoc) {
                            frameDoc.removeEventListener('click', timeClickHandler, true);
                        }
                    } catch (e) {}
                }
                
                const scheduleTab = targetWindow.document.getElementById('emsscheduletab');
                if (scheduleTab) {
                    scheduleTab.removeEventListener('click', timeClickHandler, true);
                }
                
                timeClickHandler = null;
            }
        }
        
        // Handles clicks outside room selection area
        function handleClickOutsideRoomSelection(event) {
            const target = event.target;
            const isInUI = target.closest('#berklee-app-ui');
            const isInSchedule = target.closest('#tab_wrap');
            const isInScheduleTab = target.closest('#emsscheduletab');
            
            if (!isInUI && !isInSchedule && !isInScheduleTab) {
                console.log("🖱️ Click outside room selection - resetting");
                
                if (roomNumberField && (isMultiSelectMode || selectedRooms.size > 0)) {
                    roomNumberField.textContent = 'Room';
                }
                
                selectedRooms.clear();
                isMultiSelectMode = false;
                exitRoomSelection();
            }
        }
        
        // Sets up time selection functionality
        function setupTimeSelection() {
            console.log("⏰ Setting up time selection");
            
            if (timeSlotField) {
                timeSlotField.addEventListener('click', function(event) {
                    if (!isTimeSelectionActive) {
                        console.log("🎯 Time selection mode activated");
                        event.stopPropagation();
                        
                        if (isRoomSelectionActive) exitRoomSelection();
                        
                        isTimeSelectionActive = true;
                        timeSelectionMode = 'start';
                        startTime = null;
                        
                        timeSlotField.classList.add('selection-active');
                        timeSlotField.textContent = 'Click start time in schedule...';
                        
                        applyTimeSelectableStyles();
                        targetWindow.document.addEventListener('click', handleClickOutsideTimeSelection);
                    }
                });
            }
            
            // Handle time clicks in schedule frame
            const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
            if (scheduleFrame) {
                const setupFrameTimeListener = () => {
                    try {
                        const frameDoc = scheduleFrame.contentDocument || scheduleFrame.contentWindow.document;
                        if (frameDoc) {
                            frameDoc.addEventListener('click', function(event) {
                                if (isTimeSelectionActive) {
                                    const cell = event.target.closest('td, th');
                                    if (cell) {
                                        const timeText = cell.textContent.trim();
                                        const timeRegex = /^\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\s*(?:\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?\s*$/;
                                        
                                        const isValidTime = timeRegex.test(timeText) && 
                                                          timeText.length > 1 && 
                                                          timeText.length < 20 && 
                                                          !timeText.toLowerCase().includes('book') &&
                                                          !timeText.toLowerCase().includes('slot') &&
                                                          !timeText.toLowerCase().includes('reserve') &&
                                                          !timeText.toLowerCase().includes('available') &&
                                                          !timeText.toLowerCase().includes('click') &&
                                                          !cell.classList.contains('booking') &&
                                                          !cell.classList.contains('booked') &&
                                                          !cell.querySelector('button, input, a');
                                        
                                        if (isValidTime) {
                                            console.log("⏰ Time clicked:", timeText, "Mode:", timeSelectionMode);
                                            event.preventDefault();
                                            event.stopPropagation();
                                            event.stopImmediatePropagation();
                                            
                                            if (timeSelectionMode === 'start') {
                                                startTime = timeText;
                                                timeSelectionMode = 'end';
                                                cell.classList.add('time-start-selected');
                                                
                                                if (timeSlotField) {
                                                    timeSlotField.textContent = `${timeText} - (select end time)`;
                                                }
                                                
                                                updateTimeEndSelectionStyles();
                                            } else if (timeSelectionMode === 'end') {
                                                const endTime = timeText;
                                                const timeRange = `${startTime} - ${endTime}`;
                                                
                                                console.log("✅ Time range selected:", timeRange);
                                                
                                                if (timeSlotField) {
                                                    timeSlotField.textContent = timeRange;
                                                }
                                                
                                                if (selectedRooms.size > 0) {
                                                    createRoomItems();
                                                }
                                                
                                                exitTimeSelection();
                                            }
                                        }
                                    }
                                }
                            }, true);
                        }
                    } catch (e) {
                        console.log("⚠️ Could not access schedule frame:", e.message);
                    }
                };
                setupFrameTimeListener();
                scheduleFrame.addEventListener('load', setupFrameTimeListener);
            }
        }
        
        // Applies selectable styles to time cells
        function applyTimeSelectableStyles() {
            console.log("🎨 Applying time selectable styles");
            
            const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
            if (scheduleFrame) {
                try {
                    const frameDoc = scheduleFrame.contentDocument || scheduleFrame.contentWindow.document;
                    if (frameDoc) {
                        const cells = frameDoc.querySelectorAll('td, th');
                        cells.forEach(cell => {
                            const timeText = cell.textContent.trim();
                            const timeRegex = /^\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\s*(?:\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?\s*$/;
                            
                            const isValidTime = timeRegex.test(timeText) && 
                                              timeText.length > 1 && 
                                              timeText.length < 20 && 
                                              !timeText.toLowerCase().includes('book') &&
                                              !timeText.toLowerCase().includes('slot') &&
                                              !timeText.toLowerCase().includes('reserve') &&
                                              !timeText.toLowerCase().includes('available') &&
                                              !timeText.toLowerCase().includes('click') &&
                                              !cell.classList.contains('booking') &&
                                              !cell.classList.contains('booked') &&
                                              !cell.querySelector('button, input, a');
                            
                            if (isValidTime) {
                                cell.style.cursor = 'pointer';
                                cell.style.backgroundColor = '#fff3e0';
                                cell.style.border = '1px solid #ff9800';
                                cell.classList.add('time-selectable');
                            }
                        });
                    }
                } catch (e) {}
            }
            
            // Also apply to main schedule tab
            const scheduleTab = targetWindow.document.getElementById('emsscheduletab');
            if (scheduleTab) {
                const headerCells = scheduleTab.querySelectorAll('thead th, thead td');
                const footerCells = scheduleTab.querySelectorAll('tfoot th, tfoot td');
                const allCells = [...headerCells, ...footerCells];
                
                allCells.forEach(cell => {
                    cell.style.cursor = 'pointer';
                    cell.style.backgroundColor = '#fff3e0';
                    cell.style.border = '1px solid #ff9800';
                    cell.classList.add('time-selectable');
                });
            }
        }
        
        // Removes selectable styles from time cells
        function removeTimeSelectableStyles() {
            console.log("🧹 Removing time selectable styles");
            
            const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
            if (scheduleFrame) {
                try {
                    const frameDoc = scheduleFrame.contentDocument || scheduleFrame.contentWindow.document;
                    if (frameDoc) {
                        const cells = frameDoc.querySelectorAll('.time-selectable, .time-start-selected');
                        cells.forEach(cell => {
                            cell.style.cursor = '';
                            cell.style.backgroundColor = '';
                            cell.style.border = '';
                            cell.classList.remove('time-selectable', 'time-start-selected');
                        });
                    }
                } catch (e) {}
            }
            
            const scheduleTab = targetWindow.document.getElementById('emsscheduletab');
            if (scheduleTab) {
                const cells = scheduleTab.querySelectorAll('.time-selectable, .time-start-selected');
                cells.forEach(cell => {
                    cell.style.cursor = '';
                    cell.style.backgroundColor = '';
                    cell.style.border = '';
                    cell.classList.remove('time-selectable', 'time-start-selected');
                });
            }
        }
        
        // Updates time cell styles for end selection
        function updateTimeEndSelectionStyles() {
            console.log("🎨 Updating styles for end time selection");
            
            const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
            if (scheduleFrame) {
                try {
                    const frameDoc = scheduleFrame.contentDocument || scheduleFrame.contentWindow.document;
                    if (frameDoc) {
                        const cells = frameDoc.querySelectorAll('.time-selectable');
                        cells.forEach(cell => {
                            cell.style.backgroundColor = '#90EE90';
                            cell.style.border = '2px solid #228B22';
                        });
                    }
                } catch (e) {}
            }
            
            const scheduleTab = targetWindow.document.getElementById('emsscheduletab');
            if (scheduleTab) {
                const cells = scheduleTab.querySelectorAll('.time-selectable');
                cells.forEach(cell => {
                    cell.style.backgroundColor = '#90EE90';
                    cell.style.border = '2px solid #228B22';
                });
            }
        }
        
        // Exits time selection mode
        function exitTimeSelection() {
            console.log("🚪 Exiting time selection mode");
            
            isTimeSelectionActive = false;
            timeSelectionMode = 'start';
            startTime = null;
            
            if (timeSlotField) {
                timeSlotField.classList.remove('selection-active');
            }
            
            removeTimeSelectableStyles();
            targetWindow.document.removeEventListener('click', handleClickOutsideTimeSelection);
            targetWindow.document.removeEventListener('keydown', handleTimeSelectionKeypress);
        }
        
        // Handles clicks outside time selection area
        function handleClickOutsideTimeSelection(event) {
            const target = event.target;
            const isInUI = target.closest('#berklee-app-ui');
            const isInScheduleTab = target.closest('#emsscheduletab');
            const isInScheduleWrapper = target.closest('#tab_wrap');
            const isInScheduleFrame = target.closest('#scheduleframe');
            
            if (!isInUI && !isInScheduleTab && !isInScheduleWrapper && !isInScheduleFrame) {
                console.log("🖱️ Click outside time selection - resetting");
                
                if (timeSlotField && timeSelectionMode === 'end') {
                    timeSlotField.textContent = 'Click to select time range...';
                }
                
                selectedRooms.clear();
                isMultiSelectMode = false;
                
                if (roomNumberField) {
                    roomNumberField.textContent = 'Room';
                }
                
                exitTimeSelection();
            }
        }
        
        // Formats time text for display
        function formatTime(timeText) {
            return timeText.replace(/(\d+)(am|pm)/gi, '$1 $2');
        }
        
        // Creates room items from selected rooms and time
        function createRoomItems() {
            console.log("📝 Creating room items from selection");
            
            const timeText = timeSlotField.textContent.trim();
            if (selectedRooms.size > 0 && timeText && timeText !== 'Time' && timeText !== 'Click start time in schedule...') {
                Array.from(selectedRooms).forEach(roomText => {
                    const roomItem = targetWindow.document.createElement('div');
                    roomItem.className = 'room-item';
                    
                    const formattedTime = formatTime(timeText);
                    roomItem.innerHTML = `
                        <div class="room-item-content">
                            <svg class="sort-button" alt="Sort" width="8.6" height="7.1" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="8.6" height="1.2" fill="#666"/>
                                <rect y="3.4" width="8.6" height="1.2" fill="#666"/>
                                <rect y="6.8" width="8.6" height="1.2" fill="#666"/>
                            </svg>
                            <div class="room-number-item">${roomText}</div>
                            <div class="time-slot-item">${formattedTime}</div>
                            <svg class="remove-button" alt="Remove" width="13.5" height="12.8" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l12 11M13 1L1 12" stroke="#666" stroke-width="2"/>
                            </svg>
                        </div>
                    `;
                    
                    const removeButton = roomItem.querySelector('.remove-button');
                    removeButton.addEventListener('click', function() {
                        console.log("🗑️ Removing room item:", roomText);
                        roomItem.remove();
                    });
                    
                    roomList.appendChild(roomItem);
                    console.log("✅ Room item added:", roomText, formattedTime);
                });
                
                selectedRooms.clear();
                isMultiSelectMode = false;
                roomNumberField.textContent = 'Room';
                timeSlotField.textContent = 'Time';
                
                setupDragAndDrop();
            }
        }
        
        // Improved drag and drop functionality
        function setupDragAndDrop() {
            console.log("🎯 Setting up drag and drop functionality");
            
            const sortButtons = uiContainer.querySelectorAll('.sort-button');
            sortButtons.forEach(button => {
                button.addEventListener('mousedown', startDrag);
            });
        }
        
        // Starts the drag operation
        function startDrag(event) {
            if (dragState.isDragging) return;
            
            console.log("🎭 Starting drag operation");
            event.preventDefault();
            
            const draggedItem = event.target.closest('.room-item');
            if (!draggedItem) return;
            
            dragState.isDragging = true;
            dragState.draggedElement = draggedItem;
            dragState.startY = event.clientY;
            dragState.startX = event.clientX;
            dragState.originalIndex = Array.from(roomList.children).indexOf(draggedItem);
            dragState.currentIndex = dragState.originalIndex;
            
            const rect = draggedItem.getBoundingClientRect();
            dragState.draggedElement.style.position = 'fixed';
            dragState.draggedElement.style.top = rect.top + 'px';
            dragState.draggedElement.style.left = rect.left + 'px';
            dragState.draggedElement.style.width = rect.width + 'px';
            dragState.draggedElement.style.zIndex = '10000';
            dragState.draggedElement.classList.add('dragging');
            
            createPlaceholder(draggedItem);
            
            targetWindow.document.addEventListener('mousemove', handleDragMove);
            targetWindow.document.addEventListener('mouseup', handleDragEnd);
            targetWindow.document.addEventListener('mouseleave', handleDragEnd);
        }
        
        // Creates a placeholder element
        function createPlaceholder(originalElement) {
            dragState.placeholder = targetWindow.document.createElement('div');
            dragState.placeholder.className = 'room-item drag-placeholder';
            dragState.placeholder.style.height = originalElement.offsetHeight + 'px';
            roomList.insertBefore(dragState.placeholder, originalElement);
        }
        
        // Handles mouse movement during drag
        function handleDragMove(event) {
            if (!dragState.isDragging) return;
            
            const deltaY = event.clientY - dragState.startY;
            const deltaX = event.clientX - dragState.startX;
            
            dragState.draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            updateDragPosition(event);
        }
        
        // Updates the drag position and reorders items
        function updateDragPosition(event) {
            const draggedRect = dragState.draggedElement.getBoundingClientRect();
            const draggedCenter = draggedRect.top + draggedRect.height / 2;
            
            const items = Array.from(roomList.querySelectorAll('.room-item:not(.dragging):not(.drag-placeholder)'));
            let newIndex = dragState.originalIndex;
            
            for (let i = 0; i < items.length; i++) {
                const itemRect = items[i].getBoundingClientRect();
                const itemCenter = itemRect.top + itemRect.height / 2;
                
                if (draggedCenter < itemCenter) {
                    newIndex = i;
                    break;
                } else {
                    newIndex = i + 1;
                }
            }
            
            if (newIndex !== dragState.currentIndex && newIndex >= 0 && newIndex <= items.length) {
                dragState.currentIndex = newIndex;
                reorderItems();
            }
        }
        
        // Reorders the items based on current drag position
        function reorderItems() {
            const items = Array.from(roomList.querySelectorAll('.room-item:not(.dragging):not(.drag-placeholder)'));
            
            if (dragState.currentIndex >= items.length) {
                roomList.appendChild(dragState.placeholder);
            } else {
                roomList.insertBefore(dragState.placeholder, items[dragState.currentIndex]);
            }
        }
        
        // Handles the end of drag operation
        function handleDragEnd(event) {
            if (!dragState.isDragging) return;
            
            console.log("🎯 Ending drag operation");
            dragState.isDragging = false;
            
            if (dragState.draggedElement) {
                dragState.draggedElement.style.position = '';
                dragState.draggedElement.style.top = '';
                dragState.draggedElement.style.left = '';
                dragState.draggedElement.style.width = '';
                dragState.draggedElement.style.zIndex = '';
                dragState.draggedElement.style.transform = '';
                dragState.draggedElement.classList.remove('dragging');
                
                if (dragState.placeholder && dragState.placeholder.parentNode) {
                    roomList.insertBefore(dragState.draggedElement, dragState.placeholder);
                    dragState.placeholder.remove();
                } else {
                    roomList.appendChild(dragState.draggedElement);
                }
            }
            
            dragState.draggedElement = null;
            dragState.placeholder = null;
            
            targetWindow.document.removeEventListener('mousemove', handleDragMove);
            targetWindow.document.removeEventListener('mouseup', handleDragEnd);
            targetWindow.document.removeEventListener('mouseleave', handleDragEnd);
        }
        
        // Setup start button functionality
        if (startButton) {
            startButton.addEventListener('click', function() {
                console.log("🚀 Start button clicked - beginning navigation process");
                startNavigationProcess();
            });
        }
        
        // Setup go button functionality
        if (goButton) {
            goButton.addEventListener('click', function() {
                console.log("➕ Go button clicked - adding room item");
                
                const roomText = roomNumberField.textContent.trim();
                const timeText = timeSlotField.textContent.trim();
                
                if (selectedRooms.size > 0 && timeText && timeText !== 'Time') {
                    createRoomItems();
                } else if (roomText && timeText && roomText !== 'Room' && timeText !== 'Time') {
                    const newItem = targetWindow.document.createElement('div');
                    newItem.className = 'room-item';
                    
                    const formattedTime = formatTime(timeText);
                    newItem.innerHTML = `
                        <div class="room-item-content">
                            <svg class="sort-button" alt="Sort" width="8.6" height="7.1" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="8.6" height="1.2" fill="#666"/>
                                <rect y="3.4" width="8.6" height="1.2" fill="#666"/>
                                <rect y="6.8" width="8.6" height="1.2" fill="#666"/>
                            </svg>
                            <div class="room-number-item">${roomText}</div>
                            <div class="time-slot-item">${formattedTime}</div>
                            <svg class="remove-button" alt="Remove" width="13.5" height="12.8" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l12 11M13 1L1 12" stroke="#666" stroke-width="2"/>
                            </svg>
                        </div>
                    `;
                    
                    const removeBtn = newItem.querySelector('.remove-button');
                    removeBtn.addEventListener('click', function() {
                        console.log("🗑️ Removing room item");
                        newItem.remove();
                    });
                    
                    roomList.appendChild(newItem);
                    setupDragAndDrop();
                    
                    roomNumberField.textContent = 'Room';
                    timeSlotField.textContent = 'Time';
                }
            });
        }
        
        // Setup existing remove buttons
        uiContainer.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', function() {
                const roomItem = button.closest('.room-item');
                console.log("🗑️ Removing existing room item");
                roomItem.remove();
            });
        });
        
        // Setup drag and drop for existing items
        setupDragAndDrop();
        
        // Setup main functionality
        setupRoomSelection();
        setupTimeSelection();
        
        // Setup input field styling
        [roomNumberField, timeSlotField].forEach(field => {
            if (field) {
                field.addEventListener('focus', function() {
                    if (!isRoomSelectionActive && !isTimeSelectionActive) {
                        this.style.caretColor = 'transparent';
                        this.style.webkitCaretColor = 'transparent';
                        this.style.mozCaretColor = 'transparent';
                        this.style.msCaretColor = 'transparent';
                    }
                });
                
                field.addEventListener('input', function() {
                    if (!isRoomSelectionActive && !isTimeSelectionActive) {
                        this.style.caretColor = 'transparent';
                        this.style.webkitCaretColor = 'transparent';
                        this.style.mozCaretColor = 'transparent';
                        this.style.msCaretColor = 'transparent';
                    }
                });
            }
        });
        
        console.log("✅ UI functionality initialized successfully");
    }

    // Navigation and booking automation
    function startNavigationProcess() {
        console.log("🚀 Starting navigation process");
        
        if (!window.berklee_target_window || window.berklee_target_window.closed) {
            console.log("❌ Target window not available for navigation");
            return;
        }
        
        // Clear any existing interval
        if (window.berklee_interval) {
            clearInterval(window.berklee_interval);
        }
        
        state.isNavigating = true;
        saveState();
        
        window.berklee_interval = setInterval(() => {
            if (window.berklee_target_window && !window.berklee_target_window.closed) {
                try {
                    const targetDocument = window.berklee_target_window.document;
                    
                    // First, check if we can still navigate forward
                    const nextButton = targetDocument.querySelector("#maincontent > div > nav > div:nth-child(1) > h3 > a.daynav.nextbtn");
                    if (nextButton) {
                        const computedStyle = window.berklee_target_window.getComputedStyle(nextButton);
                        const isDisplayNone = computedStyle.display === 'none' || nextButton.style.display === 'none';
                        const hasQuestionMark = nextButton.textContent.includes('?');
                        
                        console.log("🔍 Navigation - Button display:", computedStyle.display, "Button text:", nextButton.textContent.trim());
                        
                        if (isDisplayNone || hasQuestionMark) {
                            if (isDisplayNone) {
                                console.log("🛑 Navigation - Next button is hidden (display: none) - reached end of available days");
                            } else {
                                console.log("🛑 Navigation - Next button shows '?' - reached end of available days");
                            }
                            
                            // Add 3ms delay before checking final date
                            setTimeout(() => {
                                // Now check how many days are left and decide if we should book
                                const dateElement = targetDocument.querySelector('#date_display_view');
                                if (dateElement) {
                                    const dateText = dateElement.textContent.trim();
                                    console.log("📅 Navigation - Final date reached:", dateText);
                                    
                                    // Extract date from text like "Friday, 4 Jul, 2025"
                                    const dateMatch = dateText.match(/(\d{1,2})\s+(\w{3}),?\s+(\d{4})/);
                                    if (dateMatch) {
                                        const [, day, month, year] = dateMatch;
                                        const monthNames = {
                                            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                                            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                                        };
                                        
                                        const pageDate = new Date(parseInt(year), monthNames[month], parseInt(day));
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        pageDate.setHours(0, 0, 0, 0);
                                        
                                        const timeDiff = pageDate.getTime() - today.getTime();
                                        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                                        
                                        console.log("📊 Navigation - Days remaining at final date:", daysRemaining);
                                        
                                        if (daysRemaining === 3) {
                                            console.log("🎯 3 days remaining at final available date - attempting to book slots");
                                            // Get the UI from the target window and find slots
                                            const targetUI = targetDocument.getElementById('berklee-app-ui');
                                            if (targetUI) {
                                                const roomList = targetUI.querySelector('.room-list');
                                                if (roomList) {
                                                    // Use the booking function with the target window context
                                                    findAndBookNextAvailableSlotInWindow(window.berklee_target_window);
                                                }
                                            }
                                        } else {
                                            console.log("❌ Final available date is not 3 days ahead - no booking attempted");
                                        }
                                    }
                                }
                                
                                clearInterval(window.berklee_interval);
                                state.isNavigating = false;
                                saveState();
                            }, NAVIGATION_DELAY);
                            return;
                        }
                        
                        // Continue navigating to next day
                        const dateElement = targetDocument.querySelector('#date_display_view');
                        if (dateElement) {
                            const dateText = dateElement.textContent.trim();
                            console.log("📅 Navigation - Current date:", dateText);
                        }
                        
                        console.log("➡️ Navigation - Clicking next button (continuing until '?' appears)");
                        
                        // Add 3ms delay before clicking the right arrow
                        setTimeout(() => {
                            // Double-check the button is still clickable before clicking
                            const currentStyle = window.berklee_target_window.getComputedStyle(nextButton);
                            const isCurrentlyDisplayNone = currentStyle.display === 'none' || nextButton.style.display === 'none';
                            const currentlyHasQuestionMark = nextButton.textContent.includes('?');
                            
                            if (isCurrentlyDisplayNone || currentlyHasQuestionMark) {
                                console.log("🛑 Navigation - Button became unclickable during delay, stopping");
                                clearInterval(window.berklee_interval);
                                state.isNavigating = false;
                                saveState();
                                return;
                            }
                            
                            console.log("✅ Navigation - Button is clickable, proceeding with click");
                            state.clickCount++;
                            saveState();
                            nextButton.click();
                        }, NAVIGATION_DELAY);
                    } else {
                        console.log("❌ Next button not found - stopping navigation");
                        clearInterval(window.berklee_interval);
                        state.isNavigating = false;
                        saveState();
                    }
                    
                } catch (error) {
                    console.log("⚠️ Navigation error:", error.message);
                }
            } else {
                console.log("❌ Target window closed during navigation");
                stopScript();
            }
        }, REFRESH_INTERVAL);
    }
    
    // Helper function to find and book slots in the target window - ULTRA-OPTIMIZED FOR MAXIMUM PERFORMANCE
    function findAndBookNextAvailableSlotInWindow(targetWindow) {
        // Prevent multiple simultaneous bookings
        if (window.berklee_booking_in_progress) {
            console.log("⚠️ Booking already in progress, skipping duplicate call");
            return;
        }
        
        window.berklee_booking_in_progress = true;
        
        // Fast error handling with early returns
        if (!targetWindow?.document) {
            console.log("❌ Target window not available");
            window.berklee_booking_in_progress = false;
            return;
        }
        
        // DOM caching - get all elements in a single pass
        const targetUI = targetWindow.document.getElementById('berklee-app-ui');
        if (!targetUI) {
            console.log("❌ UI not found in target window");
            window.berklee_booking_in_progress = false;
            return;
        }
        
        // Fast DOM lookup with direct selectors
        const roomItems = targetUI.querySelectorAll('.room-list .room-item');
        if (!roomItems.length) {
            console.log("❌ No room items found for booking");
            window.berklee_booking_in_progress = false;
            return;
        }
        
        // Find the schedule table efficiently - try frame first, then main document
        let scheduleTable = null;
        try {
            const scheduleFrame = targetWindow.document.getElementById('scheduleframe');
            scheduleTable = scheduleFrame?.contentDocument?.getElementById('emsscheduletab') || 
                           targetWindow.document.getElementById('emsscheduletab');
        } catch (e) {
            console.log("⚠️ Error accessing frame:", e.message);
        }
        
        if (!scheduleTable) {
            console.log("❌ Schedule table not found");
            window.berklee_booking_in_progress = false;
            return;
        }

        // ULTRA-OPTIMIZATION: Get all bookable slots and process them in batch
        const bookableSlots = Array.from(scheduleTable.querySelectorAll('td.bookslot:not(.booked)'));
        if (!bookableSlots.length) {
            console.log("❌ No bookable slots found");
            window.berklee_booking_in_progress = false;
            return;
        }
        console.log(`📊 Found ${bookableSlots.length} bookable slots to check`);
        
        // ULTRA-OPTIMIZATION: Pre-compile regex and time parsing for batch processing
        const timeParseRegex = /(\d+)(?::(\d+))?\s*(am|pm)/i;
        const timeCache = new Map();
        
        const parseTime = (timeStr) => {
            if (timeCache.has(timeStr)) return timeCache.get(timeStr);
            
            const match = timeParseRegex.exec(timeStr);
            if (!match) return null;
            
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10) || 0;
            const ampm = match[3].toLowerCase();
            
            if (ampm === 'pm' && hours !== 12) hours += 12;
            if (ampm === 'am' && hours === 12) hours = 0;
            
            const result = hours * 60 + minutes;
            timeCache.set(timeStr, result);
            return result;
        };
        
        const parseTimeRange = (timeRange) => {
            const dashIndex = timeRange.indexOf('-');
            if (dashIndex === -1) return null;
            
            const start = parseTime(timeRange.substring(0, dashIndex).trim());
            const end = parseTime(timeRange.substring(dashIndex + 1).trim());
            
            return start && end ? { start, end } : null;
        };
        
        // ULTRA-OPTIMIZATION: Extract room requests first for batch processing
        const roomRequests = [];
        for (let i = 0, len = roomItems.length; i < len; i++) {
            const roomItem = roomItems[i];
            const roomNumberElem = roomItem.querySelector('.room-number-item');
            const timeSlotElem = roomItem.querySelector('.time-slot-item');
            
            if (!roomNumberElem || !timeSlotElem) continue;
            
            const roomNumber = roomNumberElem.textContent.trim();
            const timeSlot = timeSlotElem.textContent.trim();
            
            if (!roomNumber || !timeSlot) continue;
            
            const targetTimeRange = parseTimeRange(timeSlot);
            if (!targetTimeRange) continue;
            
            roomRequests.push({
                roomNumber,
                timeSlot,
                targetTimeRange,
                priority: i // Use order as priority
            });
        }
        
        if (!roomRequests.length) {
            console.log("❌ No valid room requests found");
            window.berklee_booking_in_progress = false;
            return;
        }
        
        // ULTRA-OPTIMIZATION: Create room filter sets for instant matching
        const requestedRooms = new Set(roomRequests.map(r => r.roomNumber));
        
        // ULTRA-OPTIMIZATION: Batch process ALL slots at once using vectorized operations
        const validSlots = bookableSlots
            .map(cell => {
                const roomTimeData = cell.getAttribute('data-roomtime');
                if (!roomTimeData) return null;
                
                const commaIndex = roomTimeData.indexOf(',');
                if (commaIndex === -1) return null;
                
                const cellRoom = roomTimeData.substring(0, commaIndex).trim();
                const cellTime = roomTimeData.substring(commaIndex + 1).trim();
                
                // ULTRA-OPTIMIZATION: Fast filter using Set lookup - O(1) instead of O(n)
                if (!requestedRooms.has(cellRoom)) return null;
                
                const cellTimeRange = parseTimeRange(cellTime);
                if (!cellTimeRange) return null;
                
                return {
                    cell,
                    room: cellRoom,
                    timeRange: cellTimeRange,
                    time: cellTime
                };
            })
            .filter(Boolean); // Remove null entries
        
        console.log(`🎯 Filtered to ${validSlots.length} potentially matching slots`);
        
        // ULTRA-OPTIMIZATION: Create lookup map for O(1) access
        const roomToSlotsMap = new Map();
        validSlots.forEach(slot => {
            if (!roomToSlotsMap.has(slot.room)) {
                roomToSlotsMap.set(slot.room, []);
            }
            roomToSlotsMap.get(slot.room).push(slot);
        });
        
        // ULTRA-OPTIMIZATION: Find all matches simultaneously using batch operations
        const allMatches = [];
        
        for (const request of roomRequests) {
            const { roomNumber, targetTimeRange, priority } = request;
            const roomSlots = roomToSlotsMap.get(roomNumber);
            
            if (!roomSlots) continue;
            
            // ULTRA-OPTIMIZATION: Use array methods for vectorized matching
            const matches = roomSlots
                .filter(slot => 
                    slot.timeRange.start >= targetTimeRange.start && 
                    slot.timeRange.end <= targetTimeRange.end
                )
                .map(slot => ({
                    ...slot,
                    priority,
                    roomNumber,
                    requestTimeSlot: request.timeSlot
                }));
            
            allMatches.push(...matches);
        }
        
        if (!allMatches.length) {
            console.log("❌ No matching slots found for booking");
            timeCache.clear();
            window.berklee_booking_in_progress = false;
            return;
        }
        
        // ULTRA-OPTIMIZATION: Sort all matches by priority and time in one operation
        const bestMatch = allMatches
            .sort((a, b) => {
                // Primary sort: by priority (room order)
                if (a.priority !== b.priority) return a.priority - b.priority;
                // Secondary sort: by start time (earliest first)
                return a.timeRange.start - b.timeRange.start;
            })[0]; // Take the first (best) match
        
        console.log("✅ Found best matching slot! Clicking:", bestMatch.roomNumber, bestMatch.time);
        bestMatch.cell.click();
        
        // Release references to help GC
        timeCache.clear();
        requestedRooms.clear();
        roomToSlotsMap.clear();
        
        // Clear the flag and exit immediately after successful click
        window.berklee_booking_in_progress = false;
        return;
    }

    function stopScript() {
        console.log("🏁 Script completed - cleaning up");
        state.active = false;
        state.isNavigating = false;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SCRIPT_KEY);
        localStorage.removeItem(UI_INJECTED_KEY);
        if (window.berklee_interval) {
            clearInterval(window.berklee_interval);
        }
        if (window.berklee_target_window) {
            try {
                // Remove UI from target window
                const targetUI = window.berklee_target_window.document.getElementById('berklee-app-ui');
                if (targetUI) {
                    targetUI.remove();
                }
            } catch (e) {
                console.log("⚠️ Could not clean up target window UI:", e.message);
            }
            window.berklee_target_window.close();
        }
    }

    // Debug: Check state before opening window
    console.log("🔍 Debug - state.windowOpened:", state.windowOpened);
    console.log("🔍 Debug - window.berklee_target_window exists:", !!window.berklee_target_window);
    console.log("🔍 Debug - window still open:", window.berklee_target_window && !window.berklee_target_window.closed);
    
    // Check if we need to open a window (either never opened, or window was lost/closed)
    const needsWindow = !state.windowOpened || !window.berklee_target_window || window.berklee_target_window.closed;
    console.log("🔍 Debug - Needs window:", needsWindow);
    
    // Open target window if not already opened
    if (needsWindow) {
        console.log("🪟 Opening target window...");
        
        // Use dimensions and position from current window
        const width = window.outerWidth || 1200;
        const height = window.outerHeight || 800;
        const left = window.screenX !== undefined ? window.screenX : (window.screenLeft || 0);
        const top = window.screenY !== undefined ? window.screenY : (window.screenTop || 0);
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
        
        window.berklee_target_window = window.open(location.href, 'berklee_ensemble_target', windowFeatures);
        
        if (window.berklee_target_window) {
            console.log("✅ Target window opened successfully");
            state.windowOpened = true;
            saveState();
        } else {
            console.log("❌ Failed to open target window - popup blocked?");
            return;
        }
        
        // Set up UI injection and monitoring
        if (window.berklee_interval) {
            clearInterval(window.berklee_interval);
        }
        
        window.berklee_interval = setInterval(() => {
            console.log("🔄 Checking target window...");
            if (window.berklee_target_window && !window.berklee_target_window.closed) {
                try {
                    injectUIIntoWindow(window.berklee_target_window);
                } catch (error) {
                    console.log("⚠️ Could not inject UI:", error.message);
                }
            } else {
                console.log("❌ Target window was closed - stopping script");
                stopScript();
            }
        }, REFRESH_INTERVAL);
        
        console.log("✅ Script is now running. The target window will be monitored for UI injection.");
        console.log("📝 Close this bookmarklet window or the target window to stop the script.");
    } else {
        console.log("🔍 Window already exists and is open - reusing existing window");
        console.log("✅ Script is now running with existing window.");
    }

})();
