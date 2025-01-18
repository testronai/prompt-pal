document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    // Set initial mode to dark
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');

    // Font sizes in pixels for different modes
    const FONT_SIZES = {
        small: 30,
        medium: 39,
        large: 48
    };

    // Line heights (multiplier of font size)
    const LINE_HEIGHT_MULTIPLIER = 1.6;

    // Global variables
    let isScrolling = false;
    let scrollPixelsPerSecond = 20; // Default speed (slow)
    let animationFrameId = null;
    let lastTime = null;
    let accumulatedScroll = 0;
    let currentFontSize = 'large'; // Track current font size
    let lastScrollPosition = 0; // Track last scroll position

    // Get all DOM elements
    const startPauseBtn = document.getElementById('startPauseBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const scriptInput = document.getElementById('scriptInput');
    const modeToggleBtn = document.getElementById('modeToggleBtn');
    const slowSpeedBtn = document.getElementById('slowSpeedBtn');
    const mediumSpeedBtn = document.getElementById('mediumSpeedBtn');
    const fastSpeedBtn = document.getElementById('fastSpeedBtn');
    const smallFontBtn = document.getElementById('smallFontBtn');
    const mediumFontBtn = document.getElementById('mediumFontBtn');
    const largeFontBtn = document.getElementById('largeFontBtn');
    const resetBtn = document.getElementById('resetBtn'); // Add Reset button

    // Add hover text for speed buttons
    slowSpeedBtn.title = "Slow: 20 pixels/second";
    mediumSpeedBtn.title = "Medium: 40 pixels/second";
    fastSpeedBtn.title = "Fast: 70 pixels/second";

    // Initialize default settings
    function initializeDefaults() {
        // Set default font size (large)
        scriptInput.style.fontSize = FONT_SIZES.large + 'px';
        scriptInput.style.lineHeight = LINE_HEIGHT_MULTIPLIER;
        
        // Set active states for font buttons
        largeFontBtn.classList.add('active');
        mediumFontBtn.classList.remove('active');
        smallFontBtn.classList.remove('active');
        
        // Set default speed (slow)
        slowSpeedBtn.classList.add('active');
        mediumSpeedBtn.classList.remove('active');
        fastSpeedBtn.classList.remove('active');
    }

    // Add spacebar control for play/pause
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is spacebar and the target is not the textarea
        if (event.code === 'Space' && event.target !== scriptInput) {
            // Prevent default spacebar behavior (page scroll)
            event.preventDefault();
            
            // Toggle play/pause
            if (isScrolling) {
                stopScrolling();
            } else {
                startScrolling();
            }
            
            console.log('Spacebar pressed - Toggling scroll state:', { isScrolling });
        }
    });

    // Call initialization
    initializeDefaults();

    // Verify all elements are found
    console.log('Elements found:', {
        startPauseBtn: !!startPauseBtn,
        scriptInput: !!scriptInput,
        slowSpeedBtn: !!slowSpeedBtn,
        mediumSpeedBtn: !!mediumSpeedBtn,
        fastSpeedBtn: !!fastSpeedBtn
    });

    function calculateVisibleLines() {
        const fontSize = FONT_SIZES[currentFontSize];
        const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
        const focusAreaHeight = 200; // Height of focus area in pixels
        return Math.floor(focusAreaHeight / lineHeight);
    }

    function calculateTotalTextAreaLines() {
        const fontSize = FONT_SIZES[currentFontSize];
        const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
        const textAreaHeight = scriptInput.clientHeight;
        return Math.floor(textAreaHeight / lineHeight);
    }

    function calculatePaddingLines() {
        const visibleLines = calculateVisibleLines();
        const totalLines = calculateTotalTextAreaLines();
        const fontSize = FONT_SIZES[currentFontSize];
        const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
        
        // Reduced buffer values due to larger font sizes
        const fontSizeBuffer = {
            small: 1,     // Reduced from 2 to 1
            medium: 1,    // Reduced from 2 to 1
            large: 1      // Kept at 1
        }[currentFontSize];

        // Reduced multipliers for prefix lines due to larger fonts
        const visibleLinesMultiplier = {
            small: 0.5,   // Reduced from 0.8 to 0.5
            medium: 0.4,  // Reduced from 0.7 to 0.4
            large: 0.3    // Reduced from 0.6 to 0.3
        }[currentFontSize];

        const prefixLines = Math.ceil(visibleLines * visibleLinesMultiplier) + fontSizeBuffer;
        const suffixLines = Math.ceil(visibleLines * 1.2) + fontSizeBuffer; // Reduced from 1.5 to 1.2

        // Debug logging
        console.log('=== Padding Lines Calculation Debug ===');
        console.log(`Font Size: ${currentFontSize}`);
        console.log(`Font Size in pixels: ${fontSize}px`);
        console.log(`Line Height: ${lineHeight}px`);
        console.log(`Focus Area Height: 200px`);
        console.log(`Visible Lines in Focus Area: ${visibleLines}`);
        console.log(`Total Text Area Lines: ${totalLines}`);
        console.log('\nBuffer Calculations:');
        console.log(`Font Size Buffer: ${fontSizeBuffer}`);
        console.log(`Visible Lines Multiplier: ${visibleLinesMultiplier}`);
        console.log('\nFinal Line Counts:');
        console.log(`Prefix Lines: ${prefixLines} (${visibleLines} × ${visibleLinesMultiplier} + ${fontSizeBuffer})`);
        console.log(`Suffix Lines: ${suffixLines} (${visibleLines} × 1.2 + ${fontSizeBuffer})`);
        console.log('===================================');

        return {
            prefixLines,
            suffixLines
        };
    }

    function getEmptyLines(count) {
        return '\n'.repeat(count);
    }

    function animate(currentTime) {
        console.log('Animate called:', { currentTime, isScrolling, lastTime });
        
        if (!isScrolling) {
            console.log('Animation stopped: isScrolling is false');
            return;
        }
        
        if (lastTime !== null) {
            const deltaTime = currentTime - lastTime;
            const scrollAmount = (scrollPixelsPerSecond * deltaTime) / 1000;
            accumulatedScroll += scrollAmount;
            
            // Only update scroll when we have at least 1 pixel to scroll
            if (accumulatedScroll >= 1) {
                const scrollPixels = Math.floor(accumulatedScroll);
                accumulatedScroll -= scrollPixels;
                
                const previousScroll = scriptInput.scrollTop;
                scriptInput.scrollTop += scrollPixels;
                
                console.log('Scroll calculation:', {
                    deltaTime,
                    scrollAmount,
                    scrollPixels,
                    previousScroll,
                    currentScroll: scriptInput.scrollTop,
                    maxScroll: scriptInput.scrollHeight - scriptInput.clientHeight
                });
                
                // Stop if we've reached the bottom or if scroll didn't change
                if (scriptInput.scrollTop >= scriptInput.scrollHeight - scriptInput.clientHeight ||
                    previousScroll === scriptInput.scrollTop) {
                    console.log('Reached bottom or cannot scroll further, stopping scroll');
                    stopScrolling();
                    return;
                }
            }
        }
        
        lastTime = currentTime;
        animationFrameId = requestAnimationFrame(animate);
    }

    function startScrolling() {
        console.log('Starting scroll');
        
        if (!isScrolling) {
            // Only add padding and set initial position if we're not resuming
            if (startPauseBtn.textContent === 'Start') {
                const originalText = scriptInput.value;
                const { prefixLines, suffixLines } = calculatePaddingLines();
                
                // Add empty lines before and after the content
                const paddedText = getEmptyLines(prefixLines) + 
                                 originalText.trim() + 
                                 getEmptyLines(suffixLines);
                
                scriptInput.value = paddedText;
                
                // Calculate initial scroll position to show first line in focus area
                const fontSize = FONT_SIZES[currentFontSize];
                const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
                
                // Adjust initial scroll position to position text at start of focus area
                const focusAreaOffset = Math.floor(prefixLines * 0.3);
                scriptInput.scrollTop = focusAreaOffset * lineHeight;
                
                console.log('Initial scroll position:', {
                    lineHeight,
                    focusAreaOffset,
                    scrollTop: scriptInput.scrollTop,
                    prefixLines
                });
            } else {
                // Resume from last position
                scriptInput.scrollTop = lastScrollPosition;
                console.log('Resuming from position:', lastScrollPosition);
            }
        }
        
        accumulatedScroll = 0;
        lastTime = null;
        isScrolling = true;
        startPauseBtn.textContent = 'Pause';
        animationFrameId = requestAnimationFrame(animate);
        console.log('Scroll started with frame:', animationFrameId);
    }

    function stopScrolling() {
        console.log('Stopping scroll');
        isScrolling = false;
        startPauseBtn.textContent = 'Resume';
        lastScrollPosition = scriptInput.scrollTop;
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            console.log('Animation frame cancelled');
        }
        lastTime = null;
        accumulatedScroll = 0;

        // Only remove padding if we've reached the end
        if (scriptInput.scrollTop >= scriptInput.scrollHeight - scriptInput.clientHeight) {
            scriptInput.value = scriptInput.value.trim(); // Remove all padding
            lastScrollPosition = 0;
        }
    }

    // Start/Pause functionality
    startPauseBtn.addEventListener('click', function() {
        console.log('Start/Pause clicked. Current state:', { isScrolling });
        if (isScrolling) {
            stopScrolling();
        } else {
            startScrolling();
        }
    });

    // Speed control buttons
    slowSpeedBtn.addEventListener('click', function() {
        setActiveButton(this, [mediumSpeedBtn, fastSpeedBtn]);
        scrollPixelsPerSecond = 20;
        console.log('Speed set to slow:', scrollPixelsPerSecond);
    });

    mediumSpeedBtn.addEventListener('click', function() {
        setActiveButton(this, [slowSpeedBtn, fastSpeedBtn]);
        scrollPixelsPerSecond = 40;
        console.log('Speed set to medium:', scrollPixelsPerSecond);
    });

    fastSpeedBtn.addEventListener('click', function() {
        setActiveButton(this, [slowSpeedBtn, mediumSpeedBtn]);
        scrollPixelsPerSecond = 70;
        console.log('Speed set to fast:', scrollPixelsPerSecond);
    });

    // Font size control buttons
    smallFontBtn.addEventListener('click', function() {
        setActiveButton(this, [mediumFontBtn, largeFontBtn]);
        scriptInput.style.fontSize = FONT_SIZES.small + 'px';
        scriptInput.style.lineHeight = LINE_HEIGHT_MULTIPLIER;
        currentFontSize = 'small';
    });

    mediumFontBtn.addEventListener('click', function() {
        setActiveButton(this, [smallFontBtn, largeFontBtn]);
        scriptInput.style.fontSize = FONT_SIZES.medium + 'px';
        scriptInput.style.lineHeight = LINE_HEIGHT_MULTIPLIER;
        currentFontSize = 'medium';
    });

    largeFontBtn.addEventListener('click', function() {
        setActiveButton(this, [smallFontBtn, mediumFontBtn]);
        scriptInput.style.fontSize = FONT_SIZES.large + 'px';
        scriptInput.style.lineHeight = LINE_HEIGHT_MULTIPLIER;
        currentFontSize = 'large';
    });

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    // Dark/Light mode toggle
    modeToggleBtn.addEventListener('click', function() {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
    });

    // Reset functionality
    resetBtn.addEventListener('click', function() {
        // Stop scrolling if active
        if (isScrolling) {
            stopScrolling();
        }
        
        // Clear the text area
        scriptInput.value = '';
        
        // Reset scroll position
        scriptInput.scrollTop = 0;
        lastScrollPosition = 0;
        
        // Reset Start/Pause button text
        startPauseBtn.textContent = 'Start';
        
        console.log('Text area reset');
    });

    function setActiveButton(activeBtn, otherBtns) {
        activeBtn.classList.add('active');
        otherBtns.forEach(btn => btn.classList.remove('active'));
    }
}); 