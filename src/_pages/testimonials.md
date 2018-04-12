---
layout: page
menuOrder: 3
permalink: /testimonials/
title: Testimonials
---

{% for testimonial in site.testimonials %}
<blockquote class="c-testimonial">
    <div class="c-testimonial__content">{{ testimonial.content }}</div>
    <footer class="c-testimonial__source">{{ testimonial.source }}</footer>
</blockquote>
{% endfor %}
